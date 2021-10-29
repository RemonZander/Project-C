import './example1.css';

/*
Uitleg:
Hier exporteren wij een object. Dit object bevat een url wat een string is en een Render property die is gekoppeld aan een
arrow function.

Dus als wij dit importeren met de naam Example1 kunnen wij Render aanroepen door Example1.Render() te doen.
In de Render method doe je dan je react gedoe dus hoe je dat normaal zou gebruiken.
*/

export default {
    url: '/example1',
    Render: (queryParams) => {
        return (
            <div>
                <h1 className="example1-title">Voorbeeld 1</h1>
            </div>
        );
    },
};
