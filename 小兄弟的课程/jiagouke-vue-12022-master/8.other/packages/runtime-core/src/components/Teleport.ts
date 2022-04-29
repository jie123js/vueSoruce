export const TeleportImpl  = {
    __isTeleport:true,
    process(n1,n2,container,anchor,internals){
        let {mountChildren,patchChildren,move} = internals;
        if(!n1){
            const target = document.querySelector(n2.props.to);
            if(target){
                mountChildren(n2.children,target)
            }
        }else{
            patchChildren(n1,n2,container); // 儿子内容变化   这个时候还是发生在老容器中的

            if(n2.props.to !== n1.props.to){ // 传送的位置发生了变化
               const nextTagert =  document.querySelector(n2.props.to);;


               n2.children.forEach((child)=>{ // 将更新后的孩子放到新的容器里  移动到新的容器中
                move(child,nextTagert)
               })
            }

        }
    }
}

export const isTeleport = (type) => type.__isTeleport