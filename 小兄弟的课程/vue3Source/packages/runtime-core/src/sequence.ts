//贪心算法+二分查找  (不是很核心,但是要了解)

//3 2 8 9 5 6 7 11 15 4

//找更有潜力的

//3
//2(3比2更有潜力[贪心算法]直接替换)
//2 8
//2 8 9
//2 5 9
//2 5 6
//2 5 6 7
//2 5 6 7 11
//2 5 6 7 11 15
//2 4 6 7 11 15 (虽然顺序有问题4不应该插入,但是求都的长度是对的)

//1.思路就是当前这一项比我们最后一项大直接放到末尾
//2.如果当前这一项比最后一项小,需要在序列中通过二分查找找到比当前大的这一项,替换掉
//3.最优情况,就是默认递增

//标记索引 前节点追溯
//求最长递增子序列的个数

export function getSequence(arr) {
  const length = arr.length;

  const result = [0]; //默认第0个做序列
  const p = arr.slice(0); //里面内容无所谓,但是长度要和arr一样
  //const p = new Array(length).fill(0)
  let resultLastIndex;
  let start;
  let end;
  let middle;
  for (let i = 0; i < arr.length; i++) {
    let arrI = arr[i];
    if (arrI !== 0) {
      //因为vue序列中0代表要新增,没意义
      //因为这个result里面放的是对应的索引指
      resultLastIndex = result[result.length - 1]; //最后一个索引
      if (arr[resultLastIndex] < arrI) {
        result.push(i);

        p[i] = resultLastIndex; //当前放到末尾的要记住他前面那个是谁
        continue;
      }
      //这里我们需要通过二分查找,在结果集中找到比当前值大的,替换

      //递增序列 采用2分查找 是最快的
      start = 0;
      end = result.length - 1;
      while (start < end) {
        //相等就停止
        middle = ((start + end) / 2) | 0; // 向下取整简便方法|
        // 1 2 3 4 middle 6 7 8 9    6
        if (arr[result[middle]] < arrI) {
          start = middle + 1;
        } else {
          end = middle;
        }
      }
      //找到中间值后,
      if (arr[result[end]] > arrI) {
        //替换更有潜力的
        result[end] = i; //找到后把值替换成这个值的索引

        p[i] = result[end - 1];
      }
      //个数到这里是对的,但是循序有点问题
    }
  }
  // 1 默认追加
  // 2 替换
  // 3 追溯,记录前驱节点//有图片可以看看
  //通过最后一项进行回溯
  let i = result.length;
  let last = result[i - 1]; //找到最后一项
  while (i-- > 0) {
    result[i] = last;
    last = p[last];
  }
  console.log(result);

  return result;
}

//getSequence([1, 2, 3, 4, 5, 6, 7]);

//getSequence([3, 2, 8, 9, 5, 6, 7, 11, 15, 4]); //[ 1, 9, 5, 6, 7, 8 ]索引(2,4,6,7,11,15)

getSequence([2, 3, 1, 5, 6, 8, 7, 9, 4]);
