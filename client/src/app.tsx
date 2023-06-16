import './app.less'
import { ConfigProvider } from '@nutui/nutui-react-taro'

const theme = {
  nutuiBrandColor: '#2103e3',
  nutuiBrandColorStart: '#2103e3',
  nutuiBrandColorEnd: '#2103e3',
}

const App = (props) => {

    return <ConfigProvider theme={theme}>
      {props.children}
    </ConfigProvider>
}
export default App
