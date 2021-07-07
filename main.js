'use strict';
function toFarenheit(num) {
    return (num * (9 / 5) + 32).toPrecision(6)
}
function toKelvin(num) {
    return (num + 273.15).toPrecision(6)
}
window.addEventListener('DOMContentLoaded', () => {
    const periodicTable = document.getElementById('periodic-Table');
    const remove = document.querySelector('button');
    const bgCanvas = document.querySelector('canvas#background')

    let name = document.querySelector('.name');
    let pProperties = document.querySelector('.p-properties');
    let cProperties = document.querySelector('.c-properties');
    let particles = document.querySelector('.particles');
    let structure = document.querySelector('.structure');
    let summary = document.querySelector('.summary')
    let canvas1 = document.createElement('canvas');
    let canvas2 = document.createElement('canvas');

    canvas1.id = 'structure1';
    canvas2.id = 'structure2';
    structure.appendChild(canvas1)
    structure.appendChild(canvas2)

    //Acessing the dom ↑ ↑ ↑

    // window.setTimeout(() => {
    //     alert('Use a Laptop or desktop for best user experience')
    // }, 2000)

    remove.addEventListener('click', () => {
        bgCanvas.classList.toggle('none')
    })

    
    
    let jsonData =  fetch('PeriodicTable.json')//Fetching data
    jsonData.then(response => {
        return response.json()
    })
    
    .then(elements => {
        elements.forEach((element, i) => { //Creating a div for each object
            const elem = document.createElement('div');
            let id = i += 1;
            elem.className = 'element' + ' n' + id + ' ' + element.category;
            elem.innerHTML = '<p class="number">' + element.atomicNumber + '</p>' + '<h1>' + element.symbol + '</h1>' + '<p>' + element.name + '</p>';
            periodicTable.appendChild(elem);
            
            //Event listeners
            elem.addEventListener('click', () => {
                name.classList = 'card ' + 'name ' + element.category
                pProperties.classList = 'card ' + 'p-properties ' + element.category
                cProperties.classList = 'card ' + 'c-properties ' + element.category
                particles.classList = 'card ' + 'particles ' + element.category
                structure.classList = 'card ' + 'structure ' + element.category
                summary.classList = 'card ' + 'summary ' + element.category
                if(id == element.atomicNumber) {


                    
                    name.innerHTML = ` <h3>${element.atomicNumber}</h3><br><br/>
                                    <h1>${element.symbol}</h1><br><br/>
                                    <h2>${element.name}</h2> `
                    pProperties.innerHTML = `<tag>Physical properties</tag> <br/><br/>
                                            <strong>Appearance : </strong> ${element.appearance} <br/><br/>
                                            <strong>State (STP) : </strong> ${element.state}`;
                    
                    cProperties.innerHTML = `<tag>Chemical properties</tag> <br/><br/>
                                            <strong>Boiling-point : </strong> ${element.boilingPoint} 
                                            <select>
                                                <option value="°C" selected>°C</option>
                                                <option value="°F">°F</option>
                                                <option value="K">K</option>
                                            </select>
                                            <br/><br/>
                                            <strong>Melting-point : </strong> ${element.meltingPoint} 
                                            <select>
                                                <option value="°C" selected>°C</option>
                                                <option value="°F">°F</option>
                                                <option value="K">K</option>
                                            </select>
                                            <br/><br/>
                                            <strong>Density : </strong> ${element.density} <br/><br/>
                                            <strong>Atomic mass : </strong> ${element.atomicMass} g/mol`;
                            
                    particles.innerHTML = `<tag>Particle data</tag> <br/><br/>
                                        <strong>Electrons : </strong> ${element.atomicNumber} <br/><br/>
                                        <strong>Protons : </strong> ${element.atomicNumber} <br/><br/>
                                        <strong>Neutrons : </strong> ${Math.round(element.atomicMass) - element.atomicNumber}`

                    summary.innerHTML = element.description 

                    drawAtom(canvas1, element.atomicNumber, element.symbol);
                    drawAtom(canvas2, element.atomicNumber, element.symbol);

                    const units = document.querySelectorAll('select');
                    units.forEach(unit => {
                        let point = unit.previousSibling.textContent;
                        unit.addEventListener('change', (e) => {
                            if (e.target.value == '°F') {
                                unit.previousSibling.textContent = toFarenheit(parseFloat(point))
                            } else if (e.target.value == '°C') {
                                unit.previousSibling.textContent = point
                            } else if (e.target.value == 'K') {
                                unit.previousSibling.textContent = toKelvin(parseFloat(point))
                            } 
                        })
                    })
                }
            })
            });
        })

    function drawAtom(canvas, electronCount, text) {
        let c = canvas.getContext('2d');
        canvas.width = 200;
        canvas.height = 200;
        // Utility Functions
        function randomIntFromRange(min, max) {
            return Math.floor(Math.random() * (max - min + 1) + min);
        }
        class Atom {
            constructor(x, y, radius, color) {
                this.x = x;
                this.y = y;
                this.radius = radius;
                this.color = color;
                this.radians = Math.random() * 360;
                this.dfc = {
                    x: randomIntFromRange(15, canvas.width / 2 - 2),
                    y: randomIntFromRange(15, canvas.height / 2 - 2)
                };

                this.update = function () {
                    if (this.radius <= 5) {
                        this.radians += 0.03;
                        this.x = x + Math.cos(this.radians) * this.dfc.x;
                        this.y = y + Math.sin(this.radians) * this.dfc.y;
                    }
                    this.draw();
                };

                this.draw = function () {
                    c.beginPath();
                    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
                    c.fillStyle = this.color;
                    c.fill();
                    c.font = '15px Verdana';
                    c.textAlign = 'center';
                    c.textBaseline = 'middle';
                    c.fillStyle = 'white';
                    c.fillText(text, canvas.width / 2, canvas.height / 2);
                };
            }
        }

        let atoms;
        function init() {
            atoms = [];
            var x = canvas.width / 2;
            var y = canvas.height / 2;
            var radius = 2;
            atoms.push(new Atom(x, y, 15, 'black'))
            for (var i = 0; i < electronCount; i++) {
                atoms.push(new Atom(x, y, radius, "black"))
            }
        }
        function animate() {
            requestAnimationFrame(animate);
            c.clearRect(0, 0, innerWidth, innerHeight);
            atoms.forEach(atom => {
                atom.update()
            })
        }
        init();
        animate();
    }
})