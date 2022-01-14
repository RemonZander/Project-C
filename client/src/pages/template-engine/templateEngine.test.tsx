import { getEntryPointsRecursive } from './templateEngine';


describe("Template engine tests", () => {
    test("getEntryPointsRecursive, input container with no child elements", () => {
        // Arrange
        const testElement = document.createElement('div');

        // Act / Assert
        expect(() => getEntryPointsRecursive(testElement)).toThrowError();
    })

    test("getEntryPointsRecursive, standard container", () => {
        // Arrange
        const testElement = document.createElement('div');

        const entryPoint = document.createElement('div');
        entryPoint.style.display = 'block';

        const span1 = document.createElement('span')
        span1.innerHTML = "Life finds a way.";
        const span2 = document.createElement('span')
        span2.innerHTML = "God help us, we're in the hands of engineers.";

        const paragraph1 = document.createElement('p')
        paragraph1.innerHTML = "Life finds a way.";
        const paragraph2 = document.createElement('p')
        paragraph2.innerHTML = "God help us, we're in the hands of engineers.";

        entryPoint.appendChild(span1);
        entryPoint.appendChild(span2);
        entryPoint.appendChild(paragraph1);
        entryPoint.appendChild(paragraph2);
        testElement.appendChild(entryPoint);

        // Act
        const result = getEntryPointsRecursive(testElement);

        // Assert
        expect(result).toBeInstanceOf(Array);
        expect(result[0].id).toBe('layer_0');
        expect(result[0].element.className).toBe('layer');
        expect(result[0].spanElements.length).toBe(2)
        expect(result[0].pElements.length).toBe(2)
    })
})