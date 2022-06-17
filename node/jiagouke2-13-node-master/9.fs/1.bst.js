// 二叉搜索树， "树的遍历“  二叉搜索树的含义是树有2个叉  (二叉树的反转)
// 前端中，很多情况后端都是给了一个数据，要格式化成树结构 路由 -》 树 。 数据格式化


class Node {
    constructor(element, parent) {
        this.element = element;
        this.parent = parent;

        this.left = null; // 左子树和右子树
        this.right = null;
    }
}
class BST {
    constructor() {
        this.root = null;
        this.size = 0;
    }
    // compare(root,element){
    //     if(root.element > element){ // 左边
    //         if(!root.left){
    //             root.left = new Node(element,root);
    //         }else{
    //             this.compare(root.left,element);
    //         }
    //     }else{ // 右边
    //         if(!root.right){
    //             root.right = new Node(element,root);
    //         }else{
    //             this.compare(root.right,element);
    //         }
    //     }
    // }
    add(element) {
        if (this.root == null) {
            this.root = new Node(element, null);
        } else {
            let current = this.root; // 此根节点是有变化的
            let parent;
            while (current) {
                parent = current;
                if (current.element < element) { // 当前节点和插入节点比较
                    current = current.right
                } else {
                    current = current.left
                }
            }
            if (parent.element < element) {
                parent.right = new Node(element, parent)
            } else {
                parent.left = new Node(element, parent)
            }
            // this.compare(root,element)
        }
        this.size++;
    }
    preorder(visitor) {
        const traversal = (root) => {
            if (root === null) return;
            visitor.visit(root.element);
            traversal(root.left);
            traversal(root.right)
        }
        traversal(this.root)
    }
    inorder(visitor) {
        const traversal = (root) => {
            if (root === null) return;
            traversal(root.left);
            visitor.visit(root.element);
            traversal(root.right)
        }
        traversal(this.root)
    }
    postorder(visitor) {
        const traversal = (root) => {
            if (root === null) return;
            traversal(root.left);
            traversal(root.right)
            visitor.visit(root.element);
        }
        traversal(this.root)
    }
    invert() {
        const traversal = (root) => {
            if (root === null) return;
            let temp = root.left;
            root.left = root.right;
            root.right = temp;
            traversal(root.left);
            traversal(root.right)
        }
        traversal(this.root)
    }
    levelorder(){
        let stack = [this.root];
        let index = 0;
        let current;
        while(current = stack[index++]){
            console.log(current.element); // 打印的是element
            if(current.left){
                stack.push(current.left);
            }
            if(current.right){
                stack.push(current.right);
            }
        }
    }
}
// 前序、中序、后续 （使用非递归来实现 利用栈和队列）、“层序遍历" 处理数据感觉用层序遍历更多一些
// 实现非递归版本的 前序中序和后续
let bst = new BST();
[10, 8, 19, 6, 15, 22, 20].forEach(item => bst.add(item))
// console.log(bst.root)

// babel  可以通过访问者模式来访问节点
bst.levelorder()