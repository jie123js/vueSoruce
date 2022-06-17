// js中没有链表， 所以我们需要自己来实现个链表来解决头尾消耗的问题


// 数据结构中 线性结构  队列、栈、链表 查询数据需要遍历 （存储数据）
// 有一组数据 用队列存 还是用链表存 查询的快？ 是一样的
// 链表操作头尾 比较方便
class Node {
    constructor(element, next) {
        this.element = element; // 当前节点中存放的内容
        this.next = next; // 当前节点的下一个元素是谁
    }
}
class LinkedList {
    constructor() {
        this.head = null; // 链表的头指针
        this.size = 0; // 链表的长度
    }
    getNode(index) {
        let current = this.head;
        for (let i = 0; i < index; i++) {
            current = current.next;
        }
        return current;
    }
    add(index,element) {
        if(arguments.length == 1){
            element = index;
            index = this.size;
        }
        if (this.head == null) {
            this.head = new Node(element)
        } else {
            let prevNode = this.getNode(index - 1);
            prevNode.next = new Node(element, prevNode.next)
        }
        this.size++;
    }
    remove(index){
        // 删除某一个要返回删除的那一项
        let removeNode;
        if(index === 0){
             removeNode = this.head;
             if(removeNode){
                this.head = this.head.next;
                this.size--;
             }
        }else{
            let prevNode = this.getNode(index - 1);
            removeNode = prevNode.next; // 删除的节点 
            prevNode.next =  prevNode.next.next;
            this.size--;
        }
        return removeNode
    }
    update(index,element){
        let currentNode = this.getNode(index);
        currentNode.element =element;
        return currentNode
    }
}
// 如何反转一个链表
// 如何判断一个链表有没有环
class Queue{
    constructor(){
        this.ll = new LinkedList();
    }
    offer(element){
        this.ll.add(element)
    }
    poll(){ // 删除头部  削掉   
       return this.ll.remove(0)
    }
}
module.exports = Queue
// ll.add(1);
// ll.add(2);
// ll.add(1,3); // 1 3 2
// ll.remove(1)
// ll.update(0,100)
// console.log(ll.head);
