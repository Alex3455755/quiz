import React from 'react';
import Menu from './components/menu';
import setings from '../setingsApp';


class CreatePage extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            listCount: [
                { header: '', variants: { A: '', B: '', C: '' }, key: 0 },
            ]
        }
        this.count = 0
    }
    helpMe = (obj) => {
        this.setState({ listCount: obj });
    }
    callBack = (obj) => {
        let a = this.state.listCount.slice(0, -1);
        obj.key = this.count
        a.push(obj);
        this.count++
        a.push({ header: '', variants: { A: '', B: '', C: '' }, key: this.count });
        this.helpMe(a);
    }
    callChange = (key, { target }) => {
        const newList = this.state.listCount.map(elem => {
            if (elem.key === key) {
                switch (target) {
                    case document.querySelector(`.var` + this.count).children[0]:
                        elem.variants.A = target.value
                        break
                    case document.querySelector('.var' + this.count).children[1]:
                        elem.variants.B = target.value
                        break
                    case document.querySelector('.var' + this.count).children[2]:
                        elem.variants.C = target.value
                        break
                    default:
                        elem.header = target.value
                        break
                }
            }
            return elem;
        });
        this.setState({listCount: newList});
    }
    requestQuiz = () => {
        let list = this.state.listCount;
        if (this.state.listCount[this.state.listCount.length - 1].header === '') {
            list = this.state.listCount.slice(0, -1);
        }
        fetch(setings.link + '/createQuiz', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify({
                header: document.getElementById('title').value,
                quizList: list,
            }),
        }).then((res) => res.json())
            .then((data) => {
                console.log(data)
            })
    }
    render() {
        return (
            <div className='container'>
                <Menu />
                <div className='main'>
                    <div className='titleCreate'>
                        <textarea type="text" max="100" id='title' placeholder='Название опроса не более 100 символов' />
                    </div>
                    {this.state.listCount.map((item) => {
                        return (<NewQuestion key={item.key} count={this.count} header={item.header} fn={this.callBack}
                            A={item.variants.A} B={item.variants.B} C={item.variants.C} callChange={this.callChange} keyProp={item.key} />);
                    })}
                    <div className='submitBox'>
                        <button onClick={this.requestQuiz}>Отправить ответы</button>
                    </div>
                </div>
            </div>
        )
    }
}
class NewQuestion extends React.Component {
    constructor(props) {
        super(props)
        this.callChange = props.callChange;
        this.fn = props.fn;
        this.key = props.keyProp;
        this.count = props.count
        this.state = { header: props.header, A: props.A, B: props.B, C: props.C }
    }
    handleChange = (event) => {
        this.callChange(this.key, event);
        switch (event.target) {
            case document.querySelector(`.var` + this.count).children[0]:
                this.setState({ A: event.target.value });
                break
            case document.querySelector('.var' + this.count).children[1]:
                this.setState({ B: event.target.value });
                break
            case document.querySelector('.var' + this.count).children[2]:
                this.setState({ C: event.target.value });
                break
            default:
                this.setState({ header: event.target.value });
                break
        }
    }
    addQuestion = () => {
        this.fn({ header: this.state.header, variants: { A: this.state.A, B: this.state.B, C: this.state.C }, key: 0 });
    }
    render() {
        return (
            <div id='newQuestion'>
                <input type='text' placeholder='Текст Вопроса' value={this.state.header} onChange={this.handleChange} />
                <div className={'variants ' + `var` + this.count}>
                    <input placeholder='Вариант Ответа' value={this.state.A} onChange={this.handleChange} />
                    <input placeholder='Вариант Ответа' value={this.state.B} onChange={this.handleChange} />
                    <input placeholder='Вариант Ответа' value={this.state.C} onChange={this.handleChange} />
                </div>
                <button onClick={this.addQuestion}>Добавить</button>
            </div>
        )
    }
}



export default CreatePage;