# redux-rex 设计初稿

# 约定

* 1、因为项目的名字还没定，这里暂定为 `redux-rex` 吧。
* 2、为了方便，本文把 `redux` 中所有的副作用相关的操作统称为 `task`。

# 目的

这里主要介绍 `redux-rex` 想做什么事情，有什么优势。对代码敏感的同学可以直接看 `demo`

* [List.js](./demo/List.js)
* [Counter.js](./demo/Counter.js)
* [SmartCounter.js](./demo/SmartCounter.js)

## 1、去掉冗余的 `action`

在 redux 中，action 不仅可以用来简单的描述相关信息，让 reducer 改变 state。因为 middleware 的纯在，action 也可以做 `task`。

如果只考虑与 `middleware` 无关的 action，redux 的流程是：View 层 dispatch 一个 action，action 再去通知 reducer 改变store。即

```
view -> action -> reducer
```

那么，为什么不直接让 view 去通知 reducer 改变 store 呢？

```
view -> reducer
```

在使用 `redux` 的开发中，大家是否都有这种冗余 `action` 的痛点。

当然，`redux-rex` 只是在暴露给用户的那一层去掉了 `action`，内部依然是用 action 的方式去做，以及遵守 `redux` 的“三大原则”。

## 2、把 `task` 集中到一起

考虑到 “目的1” 的场景，是否可以考虑把 `task` 从 `action` 中剥离出来，`task` 的归 `task`，`view` 直接调用 `reducer` 和 `task`。

`redux-saga` 正是使用了这一概念，让 `task` 独树一帜，从 `action` 中剥离，反过来也让 `action` 保持原来的 “单纯”。

## *3、`Compose`

组合是 `redux` 的另一大[痛点](https://github.com/reactjs/redux/issues/1528)。

1) 组合 `Component`。

为了让 `SubApplication`（比如 App 中的某个模块）可复用，大家是可谓八仙过海，各显神通。

有些人用一个 prefix 去拼凑 action type，然后抛出 reducer，有些人干脆放弃 global store。

实际上，`redux-rex` 能够做到 Component 即插即用，不需要去额外配置 reducer，不需要配置 saga。这些已经在技术上做了调研，可以实现。

也就是说，`redux-rex` 用起来要和 Smart Component 一样，不需要关心 reducer，而实际上又会默默地自动地 combineReducer 到相应的位置。

2）组合 `reducer`

由于 action type 是全局唯一的，因此传统的 reducer 是难以复用的。如果 action type 局部唯一，reducer 复用也不难了。

使用 `redux-rex` 复用 reducer 的例子。

```js
function myReducer(state) {

return {
    ...commonReducer(state),
    // my reducer code here...
    onChange(e) {
      return {
        ...state,
        text: e.target.value,
      };
    }
  };
}
```

3）组合 `task`

不赘言。

## 4、确保纯函数的 `View`

用 `redux` 这一套，按理说 `View` 完全可以写成纯函数的形式。但是，有些页面需要做这种事情：

```js
componnetDidMount() {
  this.props.loadInitData();
}
```
这种初始化的副作用操作应该放在 `task` 中，而不是 `View` 中。

## 5、用 redux 解决一些 smart ui 组件逻辑复杂的问题。

部分 smart 类型的 ui 组件，因为要兼容的 case 太多，state 的管理逻辑非常复杂，为什么不选择用 redux 来做数据管理呢？类似这种[做法](https://github.com/acdlite/recompose/blob/master/docs/API.md#withreducer)。

# 思路/想法

窃以为，`redux` 作者在参考 `elm` 时，因为受 `flux` 的影响，增加了 `action` 这一层。因为受到 `koa` 的影响，赋予中间件去修饰 `dispatch` 的能力，赋予“增强器”修饰 `createStore` 的能力。

当然大牛的选择必然是经过深思熟虑的，没我说的这么简单。并且事实上，这套架构也让熟悉 `flux` 这一套的同学更加易于理解，也让 redux 拥有强大的扩展能力。`redux-rex` 就是基于这种强大的扩展能力才能实现。

`redux-rex` 的 task 部分会用 `saga` 来做，但是会做小小的修饰。比如 `redux-saga` 有一个缺陷，`redux-saga` 是用 `watcher -> worker` 的方式来跑的，很多时候必须写一个空的 `action` ，来通知 `saga` 执行某个 `worker`，即：

```
view -> action -> saga
```

`redux-rex` 已经会把 `action` 和谐掉了，因此新的方式是：

```
view -> saga
```

`redux-rex` 只暴露两个函数：`run` 和 `runLocal`。`run` 用来抛出能够绑定 global store 的 `Component`，`runLocal` 用来抛出使用自身 store 的 `Component`，即用来做 smart 类型的组件。

# redux-devtool

ReactEurope Conf , redux 作者说，未来 devtool 是一个可以发力的地方。的确，有这样一个扩展能力极强的 redux 架构，devtool 怎么玩都行，关键看你有怎样的需求！

1、赋予 `redux-devtool` 直接修改 state 的能力。这对测试 View 非常易用。类似[react-cosmos](https://github.com/react-cosmos/react-cosmos)做的。

2、`redux-devtool` 可以直接 dispatch 一个 action ，但是交互很不友好，比较难用。是否可以做一个强大易用的能够直接调用 action、task 或者 reducer 的 devtool 工具？
