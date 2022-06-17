const EventEmitter = require("events");
const fs = require("fs");
const Queue = require("./linkList");

class WriteStream extends EventEmitter {
    constructor(path, options = {}) {
        super();
        this.path = path;
        this.highWaterMark = options.highWaterMark || 16 * 1024;
        this.flags = options.flags || 'w';
        this.len = 0;
        this.needDrain = false; // 是否触发drain事件
        this.writing = false
        this.offset = 0;
        this.cache = new Queue()
        this.open();
    }
    open() {
        fs.open(this.path, this.flags, (err, fd) => {
            this.fd = fd;
            this.emit('open', fd)
        })
    }
    write(chunk, encoding = 'utf8', callback = () => { }) {
        chunk = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
        this.len += chunk.length;

        // write 返回值
        let returnVal = this.len < this.highWaterMark
        this.needDrain = !returnVal; // 是否清空后触发drain事件
        let clearBuffer = () => { // once
            callback(); // 用户的回调
            // 在去清空缓存
            this.clearBuffer();
        }
        if (this.writing) { // 正在写入要放到缓存中
            this.cache.offer({
                chunk,
                encoding,
                callback: clearBuffer
            })
        } else {
            // 这里放入一个真正的写入操作
            this.writing = true;
            this._write(chunk, encoding, clearBuffer);
        }
        return returnVal;
    }
    end(chunk = '',encoding){
        chunk = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
        this._write(chunk, encoding, ()=>{
            this.emit('close'); // 保证都写入完在关闭
        });
    }
    clearBuffer() {
        let node = this.cache.poll(); // 拿出第一个
        if (node) { // 数组可以充当队列 但是取出第一个后面塌陷 （用链表来实现的队列）
            let {element:obj} = node
            this._write(obj.chunk, obj.encoding, obj.callback)

        } else {
            // 没有缓存
            this.writing = false;// 重置正在写入标识
            this.needDrain && this.emit('drain')
        }
    }
    _write(chunk, encoding, callback) {
        if (typeof this.fd !== 'number') {
            return this.once('open', () => this._write(chunk, encoding, callback))
        }
        // 将数据写入到文件中
        fs.write(this.fd, chunk, 0, chunk.length, this.offset, (err, bytesWritten) => {
            this.len -= bytesWritten; // 内存中还有多少没有写入完毕
            this.offset += bytesWritten; // 这个是写入的偏移量
            callback(); // 清空缓存
        })
    }
}
function createWriteStream() {
    return new WriteStream(...arguments)
}
module.exports = createWriteStream
// 树的遍历方式 