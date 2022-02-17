//导入element-ui里的组件
import Vue from 'vue'
// 引入 day.js
import dayjs from 'dayjs';
import {
  Button,
  Form,
  FormItem,
  Input,
  Message,
  Container,
  Header, Aside,
  Main,
  Menu,
  Submenu,
  MenuItemGroup,
  MenuItem,
  Breadcrumb,
  BreadcrumbItem,
  Card,
  Row,
  Col,
  Table,
  TableColumn,
  Switch,
  Tooltip,
  Pagination,
  Dialog,
  MessageBox,
  Tag,
  Tree,
  Select,
  Option,
  Cascader,
  Alert,
  Tabs,
  TabPane,
  Steps,
  Step,
  CheckboxGroup,
  Checkbox,
  Upload,
  Timeline,
  TimelineItem
} from 'element-ui';
Vue.use(Form);
Vue.use(Input);
Vue.use(FormItem);
Vue.use(Button);
Vue.use(Container);
Vue.use(Header);
Vue.use(Aside);
Vue.use(Main)
Vue.use(Menu)
Vue.use(Submenu)
Vue.use(MenuItemGroup)
Vue.use(MenuItem)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Card)
Vue.use(Row)
Vue.use(Col)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Switch)
Vue.use(Tooltip)
Vue.use(Pagination)
Vue.use(Dialog)
Vue.use(Tag)
Vue.use(Tree)
Vue.use(Select)
Vue.use(Option)
Vue.use(Cascader)
Vue.use(Alert)
Vue.use(Tabs)
Vue.use(TabPane)
Vue.use(Steps)
Vue.use(Step)
Vue.use(CheckboxGroup)
Vue.use(Checkbox)
Vue.use(Upload)
Vue.use(Timeline)
Vue.use(TimelineItem)
Vue.prototype.$message = Message
Vue.prototype.$confirm = MessageBox.confirm
// 全局使用语言配置
dayjs.locale('zh-cn')
// 注册为全局过滤器
Vue.filter('dateFormat', val => {
  return dayjs(val).format('YYYY-MM-DD HH:mm:ss');
});