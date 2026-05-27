<template>
  <view class="worldview-role-rail">
    <view class="worldview-role-rail__clip">
      <scroll-view class="worldview-role-rail__scroll" scroll-x :show-scrollbar="false">
        <view class="worldview-role-rail__items">
          <view
            v-if="showAdd"
            class="worldview-role-rail__item worldview-role-rail__item--add"
            @tap.stop="emit('add')"
            @click.stop="emit('add')"
          >
            <view class="worldview-role-rail__plus"></view>
          </view>
          <view v-for="item in roles" :key="item.id" class="worldview-role-rail__item">
            <image v-if="item.avatarUrl" class="worldview-role-rail__image" :src="item.avatarUrl" mode="aspectFill" />
            <wd-icon v-else name="image" size="22rpx" color="#8aa1ac" />
          </view>
        </view>
      </scroll-view>
    </view>
    <image class="worldview-role-rail__fade" src="/static/worldview/role-scroll-right-fade.png" mode="scaleToFill" />
  </view>
</template>

<script setup lang="ts">
export interface WorldviewRoleRailItem {
  id: number | string
  avatarUrl?: string
}

withDefaults(
  defineProps<{
    roles: WorldviewRoleRailItem[]
    showAdd?: boolean
  }>(),
  {
    showAdd: false
  }
)

const emit = defineEmits<{
  (event: 'add'): void
}>()
</script>

<style scoped lang="scss">
.worldview-role-rail {
  position: relative;
  width: 100%;
  height: 140rpx;
  background-color: #fcfcfc;
  border-radius: 70rpx;
  overflow: hidden;
}

.worldview-role-rail__clip {
  position: absolute;
  left: 22rpx;
  top: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
}

.worldview-role-rail__scroll {
  width: 100%;
  height: 100%;
}

.worldview-role-rail__items {
  width: max-content;
  height: 94rpx;
  display: flex;
  align-items: center;
  gap: 20rpx;
  padding: 23rpx 0;
}

.worldview-role-rail__item {
  width: 94rpx;
  height: 94rpx;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background: #e1e1e1;
}

.worldview-role-rail__item--add {
  border: 2rpx solid #c8c8c8;
  box-sizing: border-box;
  background: rgba(255, 255, 255, 0.6);
}

.worldview-role-rail__plus {
  position: relative;
  width: 28rpx;
  height: 28rpx;
}

.worldview-role-rail__plus::before,
.worldview-role-rail__plus::after {
  content: '';
  position: absolute;
  left: 50%;
  top: 50%;
  background: #888888;
  transform: translate(-50%, -50%);
}

.worldview-role-rail__plus::before {
  width: 26rpx;
  height: 2rpx;
}

.worldview-role-rail__plus::after {
  width: 2rpx;
  height: 26rpx;
}

.worldview-role-rail__image {
  width: 100%;
  height: 100%;
}

.worldview-role-rail__fade {
  position: absolute;
  top: -4rpx;
  right: 0;
  z-index: 2;
  height: 148rpx;
  width: 70rpx;
  pointer-events: none;
}
</style>
