<template>
  <el-tree
    :data="data"
    :props="defaultProps"
    :allow-drop="allowDrop"
    :allow-drag="allowDrag"
    draggable
    node-key="id"
    @node-drag-end="handleDragEnd"
    accordion
    @node-click="handleNodeClick"
    class="menu_tree"
  >
      <template #default="{ node, data }">
      <span class="custom-tree-node">
          <span>{{ node.label }}</span>
          <span class="btnlist">
            <el-button
                type="info"
                :icon="View"
                size="small"
                circle
                plain
                @click="getView(scope.row)"
              />
              <el-button
                type="primary"
                :icon="Edit"
                size="small"
                circle
                plain
                @click="handleUpdate(scope.row)"
              />
              <el-button
                type="danger"
                :icon="Delete"
                size="small"
                circle
                plain
                @click="handleDelete(scope.row)"
              />
          </span>
        </span>
      
      </template>
  </el-tree>>
</template>

<script lang="ts" setup>
import {
  onMounted,
  watch,
  reactive,
  ref,
  getCurrentInstance,
  toRefs,
} from 'vue';
import {
  listMenus,
  getMenuDetail,
  listMenuOptions,
  addMenu,
  deleteMenus,
  updateMenu,
} from '@/api/system/menu';
import { Search, Plus, Edit, Refresh, Delete,View } from '@element-plus/icons-vue';
import type Node from 'element-plus/es/components/tree/src/model/node'
import type { DragEvents } from 'element-plus/es/components/tree/src/model/useDragNode'
import type { DropType } from 'element-plus/es/components/tree/src/tree.type'
onMounted(()=>{
  listMenuOptions().then(res=>{
    console.log(res);
  })
})
const append = (data: Tree) => {
}

const remove = (node: Node, data: Tree) => {
}
const handleDragEnd = (
  draggingNode: Node,
  dropNode: Node,
  dropType: DropType,
  ev: DragEvents
) => {
  console.log('tree drag end:', draggingNode , dropNode, dropType)
}
const allowDrop = (draggingNode: Node, dropNode: Node, type: DropType) => {
  if (dropNode.data.label === 'Level two 3-1') {
    return type !== 'inner'
  } else {
    return true
  }
}

const allowDrag = (draggingNode: Node) => {
  return !draggingNode.data.label.includes('Level three 3-1-1')
}
interface Tree {
  label: string
  children?: Tree[]
}

const handleNodeClick = (data: Tree) => {
  console.log(data)
}

const data: Tree[] = [
  {
    label: 'Level one 1',
    children: [
      {
        label: 'Level two 1-1',
        children: [
          {
            label: 'Level three 1-1-1',
          },
        ],
      },
    ],
  },
  {
    label: 'Level one 2',
    children: [
      {
        label: 'Level two 2-1',
        children: [
          {
            label: 'Level three 2-1-1',
          },
        ],
      },
      {
        label: 'Level two 2-2',
        children: [
          {
            label: 'Level three 2-2-1',
          },
        ],
      },
    ],
  },
  {
    label: 'Level one 3',
    children: [
      {
        label: 'Level two 3-1',
        children: [
          {
            label: 'Level three 3-1-1',
          },
        ],
      },
      {
        label: 'Level two 3-2',
        children: [
          {
            label: 'Level three 3-2-1',
          },
        ],
      },
    ],
  },
]
const defaultProps = {
  children: 'children',
  label: 'label',
}
</script>
<style lang="scss" scoped>
.menu_tree{
  max-width: 370px;
  .custom-tree-node:hover .btnlist{
    display: inline-block;
  }
  .custom-tree-node {
     flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
  .btnlist{
    display: none;
    float: right;
  }
  }
}
</style>