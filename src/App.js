import logo from './logo.svg';
import './App.css';
import Example1 from './pages/example1/example1';
import Example2 from './pages/example2/example2';

function App() {
    const pathName = window.location.pathname;

    switch (pathName) {
        case '/example1':
            return <Example1 title="Voorbeeld 1" />;
        case '/example2':
            return <Example2 title="Voorbeeld 2" />;
        default:
            return <h1>ERROR 404</h1>;
    }
}

export default App;
