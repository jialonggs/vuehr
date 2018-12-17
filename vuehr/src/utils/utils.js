import {getRequest} from './api'
import {Message} from 'element-ui'

export const isNotNullORBlank = (...args)=> {
  for (var i = 0; i < args.length; i++) {
    var argument = args[i];
    if (argument == null || argument == '' || argument == undefined) {
      Message.warning({message: '数据不能为空!'})
      return false;
    }
  }
  return true;
}
export const initMenu = (router, store)=> {
  if (store.state.routes.length > 0) {
    return;
  }
  getRequest("/config/sysmenu").then(resp=> {
    if (resp && resp.status == 200) {
      var fmtRoutes = formatRoutes(resp.data);
      router.addRoutes(fmtRoutes);
      store.commit('initMenu', fmtRoutes);
      store.dispatch('connect');
    }
  })
}
export const formatRoutes = (routes)=> {
  let fmRoutes = [];
  routes.forEach(router=> {
    let {
      path,
      component,
      name,
      meta,
      iconCls,
      children
    } = router;
    if (children && children instanceof Array) {
      children = formatRoutes(children);
    }
    let fmRouter = {
      path: path,
      component(resolve){
        if (component.startsWith("Home")) {
          require(['../components/' + component + '.vue'], resolve)
        } else if (component.startsWith("Emp")) {
          require(['../components/emp/' + component + '.vue'], resolve)
        } else if (component.startsWith("Per")) {
          require(['../components/personnel/' + component + '.vue'], resolve)
        } else if (component.startsWith("Sal")) {
          require(['../components/salary/' + component + '.vue'], resolve)
        } else if (component.startsWith("Sta")) {
          require(['../components/statistics/' + component + '.vue'], resolve)
        } else if (component.startsWith("Sys")) {
          require(['../components/system/' + component + '.vue'], resolve)
        }else if (component.startsWith("Shou")) {
          require(['../components/sfmo/' + component + '.vue'], resolve)
        }else if (component.startsWith("Pro")) {
          require(['../components/project/' + component + '.vue'], resolve)
        }else if (component.startsWith("Order")) {
          require(['../components/order/' + component + '.vue'], resolve)
        }else if (component.startsWith("Offer")) {
          require(['../components/Offer/' + component + '.vue'], resolve)
        }else if (component.startsWith("Audit")) {
          require(['../components/Audit/' + component + '.vue'], resolve)
        }else if (component.startsWith("Tech")) {
          require(['../components/Tech/' + component + '.vue'], resolve)
        }else if (component.startsWith("Yao")) {
          require(['../components/yao/' + component + '.vue'], resolve)
        }else if (component.startsWith("Stock")) {
          require(['../components/Stock/' + component + '.vue'], resolve)
        }else if (component.startsWith("Material")) {
          require(['../components/Material/' + component + '.vue'], resolve)
        }else if(component.startsWith("Quality")){
          require(['../components/Quality/' + component + '.vue'], resolve)
        }else if(component.startsWith("Work")){
          require(['../components/Work/' + component + '.vue'], resolve)
        }else if(component.startsWith("Count")){
          require(['../components/Count/' + component + '.vue'], resolve)
        }else if(component.startsWith("Plant")){
          require(['../components/Plant/' + component + '.vue'], resolve)
        }else if(component.startsWith("Stor")){
          require(['../components/Storage/' + component + '.vue'], resolve)
        }else if(component.startsWith("FaMo")){
          require(['../components/famo/' + component + '.vue'], resolve)
        }else if(component.startsWith("FaAudit")){
          require(['../components/faaudit/' + component + '.vue'], resolve)
        }else if(component.startsWith("Finance")){
          require(['../components/finance/' + component + '.vue'], resolve)
        }else if(component.startsWith("KaiPiao")){
          require(['../components/kaipiao/' + component + '.vue'], resolve)
        }else if(component.startsWith("AfterSale")){
          require(['../components/aftersale/' + component + '.vue'], resolve)
        }
      },
      name: name,
      iconCls: iconCls,
      meta: meta,
      children: children
    };
    fmRoutes.push(fmRouter);
  })
  return fmRoutes;
}
