import ReactDOM from 'react-dom';
import { Button } from '../../../components/atoms';

describe('Button', () => {
  it('renders without crashing', () => {
    const div = document.createElement('div');
    expect(() => {
      ReactDOM.render(<Button>Hello, World!!</Button>, div);
      ReactDOM.unmountComponentAtNode(div);
    }).not.toThrow();
  });
});
