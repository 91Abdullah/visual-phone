import './App.less';
import Main from "./pages/Main"
import { BrowserRouter as Router } from "react-router-dom"
import {QueryClient, QueryClientProvider} from "react-query"
import { ReactQueryDevtools } from 'react-query/devtools'

const queryClient = new QueryClient()

function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <Router>
                <Main />
            </Router>
            <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
    );
}

export default App;
