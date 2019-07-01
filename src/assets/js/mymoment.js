import moment from 'moment'
let myfilter={};
myfilter.install=function(Vue){
   Vue.filter('formate',function(value){
  return moment(value).format('YYYY-MM-DD hh:mm:ss')
})
}
export default myfilter
