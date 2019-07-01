<template>
    <div>
        <div id="allmap" style="width:100%;height:600px"></div>
    </div>
</template>

<script>

export default {
 mounted(){
      var map = new BMap.Map("allmap");          // 创建地图实例  
      var point = new BMap.Point(106.557336,29.570663);  // 创建点坐标  
      map.centerAndZoom(point, 15);                 // 初始化地图，设置中心点坐标和地图级别      
      map.enableScrollWheelZoom(true); //开启鼠标滚轮缩放 

      map.addControl(new BMap.NavigationControl());    
      map.addControl(new BMap.ScaleControl());    
      map.addControl(new BMap.OverviewMapControl());    
      map.addControl(new BMap.MapTypeControl());    
      map.setCurrentCity("武汉"); // 仅当设置城市信息时，MapTypeControl的切换功能才能可用

      // var opts = {type: BMAP_NAVIGATION_CONTROL_ZOOM} 
      // map.addControl(new BMap.NavigationControl(opts)); 自定义控件

    //   map.setMapStyle({style:'midnight'});//地图风格
      
 }
}
</script>

<style>

</style>
