console.log("Hello from a single-file app!");

import './components/my-validator';
import './components/my-validator-list';

var suggestedValidators = [
    {name: 'Green Cloud', address: '1HtWJy6zTTc6Y1hyRTVpM6MDCpiWknsjDssUPC3FTKjfAGs'},
    {name: 'DRAGONSTAKE 🐲', address: '1dGsgLgFez7gt5WjX2FYzNCJtaCjGG6W9dA42d9cHngDYGg'}
];

var currentValidators = [
    {name: 'Polkadot.pro - Realgar', address: '1REAJ1k691g5Eqqg9gL7vvZCBG7FCCZ8zgQkZWd4va5ESih'},
    {name: 'Ryabina', address: '14xKzzU1ZYDnzFj7FgdtDAYSMJNARjDc2gNw4XAFDgr4uXgp'},
    {name: 'General-Beck', address: '15MUBwP6dyVw5CXF9PjSSv7SdXQuDSwjX86v1kBodCSWVR7c'}
];

var validatorList = document.getElementById('validator-list');
validatorList.suggestedValidators = suggestedValidators;
validatorList.currentValidators = currentValidators;