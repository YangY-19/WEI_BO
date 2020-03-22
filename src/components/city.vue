<template>
　　　　　　<div>
　　　　　　　　<div class="baiduMap">
　　　　　　　　　　<baidu-map
　　　　　　　　　　　　class="bm-view"
　　　　　　　　　　　　ak="你的百度地图ak"
　　　　　　　　　　　　center="苏州市"
　　　　　　　　　　　　:zoom="12"
　　　　　　　　　　　　:scroll-wheel-zoom="true"
　　　　　　　　　　　　@click="getClickInfo"
                      @ready="handler"
　　　　　　　　　　　　@moving="syncCenterAndZoom"
　　　　　　　　　　　　@moveend="syncCenterAndZoom"
　　　　　　　　　　　　@zoomend="syncCenterAndZoom">
　　　　　　　　　　　　　　<bm-view style="width: 100%; height:500px;"></bm-view>
　　　　　　　　　　　　　　<bm-marker
　　　　　　　　　　　　　　　　:position="{ lng: centerStr.lng, lat: centerStr.lat }"
　　　　　　　　　　　　　　　　:dragging="true"
　　　　　　　　　　　　　　　　animation="BMAP_ANIMATION_BOUNCE">
　　　　　　　　　　　　　　</bm-marker>
　　　　　　　　　　　　　　<bm-control :offset="{ width: '10px', height: '10px' }">
　　　　　　　　　　　　　　　　<bm-auto-complete v-model="keyword" :sugStyle="{ zIndex: 999999 }">
　　　　　　　　　　　　　　　　　　<a-Input
　　　　　　　　　　　　　　　　　　　　type="text"
　　　　　　　　　　　　　　　　　　　　placeholder="请输入搜索关键字"
                                     style="width:300px;height:30px"/>
　　　　　　　　　　　　　　　　</bm-auto-complete>
　　　　　　　　　　　　　　</bm-control>
　　　　　　　　　　　　　　<bm-local-search
　　　　　　　　　　　　　　　:keyword="keyword"
　　　　　　　　　　　　　　　:auto-viewport="true"
　　　　　　　　　　　　　　　style="width:0px;height:0px;overflow: hidden;"
　　　　　　　　　　　　　　></bm-local-search>
　　　　　　　　　　</baidu-map>
　　　　　　　　</div>
　　　　　　</div>
　　　　</template>

<script>
//地图组件---按需引入
import {
  BaiduMap,
  BmControl,
  BmView,
  BmAutoComplete,
  BmLocalSearch,
  BmMarker,
  BmNavigation,
  BmGeolocation,
  BmCityList
} from "vue-baidu-map";

export default {
  components: {
    BaiduMap,
    BmControl,
    BmView,
    BmAutoComplete,
    BmLocalSearch,
    BmMarker,
    BmNavigation,
    BmGeolocation,
    BmCityList
  },
  data() {
    return {
      showMapComponent: this.value,
      keyword: "",
      mapStyle: {
        width: "100%",
        height: this.mapHeight + "px"
      },
      centerStr: {
        lng: "",
        lat: ""
      }
    };
  },
  watch: {
    value: function(currentValue) {
      this.showMapComponent = currentValue;
      if (currentValue) {
        this.keyword = "";
      }
    }
  },
  methods: {
    getClickInfo(e) {
      this.centerStr.lng = e.point.lng;
      this.centerStr.lat = e.point.lat;
      let Icon_0 = new BMap.Icon(
        "icon/map_marker_check.png",
        new BMap.Size(64, 64),
        { anchor: new BMap.Size(18, 32), imageSize: new BMap.Size(36, 36) }
      );
      var myMarker = new BMap.Marker(new BMap.Point(e.point.lng, e.point.lat), {
        icon: Icon_0
      });
      // map.addOverlay(myMarker);
      //用所定位的经纬度查找所在地省市街道等信息
      var point = new BMap.Point(e.point.lng, e.point.lat);
      var gc = new BMap.Geocoder();
      let _this = this;
      gc.getLocation(point, function(rs) {
        var addComp = rs.addressComponents;
        _this.$emit('address', rs.address)
      });
    },

    syncCenterAndZoom(e) {
      const { lng, lat } = e.target.getCenter();
      this.centerStr.lng = lng;
      this.centerStr.lat = lat;
      this.zoom = e.target.getZoom();
    }
  }
};
</script>

<style lang="scss" scoped>
.head {
  width: 100px;
  margin-left: 200px;
}
.baiduMap {
  width: 100%;
  height: 500px;
  margin: 0 auto;
  　　overflow: hidden;
}
.ivu-form-item {
  　　display: inline-block;
  　　width: 40%;
}
.bm-view > div {
  　　width: 100%;
  　　height: 700px !important;
}
.serachinput {
  　　width: 300px !important;
  　　box-sizing: border-box !important;
  　　padding: 9px !important;
  　　border: 1px solid #dddee1 !important;
  　　line-height: 20px !important;
  　　font-size: 16px !important;
  　　height: 38px !important;
  　　color: #333 !important;
  　　position: relative !important;
  　　border-radius: 4px !important;
  　　-webkit-box-shadow: #666 0px 0px 10px !important;
  　　-moz-box-shadow: #666 0px 0px 10px !important;
  　　box-shadow: #666 0px 0px 10px !important;
}
</style>
