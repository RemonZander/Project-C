import './example1.css';

/*
Uitleg:
Hier exporteren wij een object. Dit object bevat een url wat een string is en een render property die is gekoppeld aan een
arrow function.

Dus als wij dit importeren met de naam Example1 kunnen wij render aanroepen door Example1.render() te doen.
In de render method doe je dan je react gedoe dus hoe je dat normaal zou gebruiken.
*/

export default {
    url: '/example1',
    render: (queryParams) => {
        return (
            <div>
                <h1 className="example1-title">Voorbeeld 1</h1>
            </div>
        );
    },
};
