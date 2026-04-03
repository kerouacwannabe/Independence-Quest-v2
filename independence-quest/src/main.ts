import './styles.css';
import { mountGame } from './game';

const root = document.getElementById('app');

if (!root) {
  throw new Error('App root #app was not found. The skull has nowhere to manifest.');
}

mountGame(root);
