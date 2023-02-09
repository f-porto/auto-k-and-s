// // knobInc maior ou igual a 4 faz apontar para cima, A = R0, B = R0, C = R0, ALU = A + B
// function turnKnob(knobPrefix, knobName, knobInc) {}

// // Executa o ciclo
// function executeCycle() {}

// // Registra a mudança no registrador
// function registerChange(theReg) {}

// Muda a velocidade da animação
// function changeSpeed() {}

let [R0, R1, R2, R3, EXECUTE, SPEED] = function obterElementos() {
    const inputs = document.querySelectorAll("table>tbody>tr>td>input");
    const speed = document.querySelector("select");
    return [inputs[0], inputs[1], inputs[2], inputs[3], inputs[4], speed];
}();

SPEED.value = '1';
changeSpeed();

function reset() {
    turnKnob('sreg', 'AAddr', 4);
    turnKnob('sreg', 'BAddr', 4);
    turnKnob('sreg', 'CAddr', 4);
    turnKnob('salu', 'ALU', 4);
}

let computing = false;

function multiply(a, b) {
    return new Promise((resolve, reject) => {
        if (computing) {
            reject("Ocupado");
            return;
        }

        loadValues(a, b);
        computing = true;
        let step = true;
        let observer = new MutationObserver(function () {
            if (EXECUTE.value === "Execute") {
                if (R1.value > 0) {
                    if (step) {
                        step1();
                        step = false;
                    } else {
                        step2();
                        step = true;
                    }
                } else {
                    observer.disconnect();
                    computing = false;
                    resolve(+R3.value);
                }
            }
        });

        observer.observe(EXECUTE, { attributes: true });
        if (EXECUTE.value === "Execute") {
            step1();
            step = false;
        }
    });
}

function loadValues(a, b) {
    R0.value = a;
    R1.value = b;
    R2.value = 1;
    R3.value = 0;

    registerChange(0);
    registerChange(1);
    registerChange(2);
    registerChange(3);
}

// Acumula
function step1() {
    reset();

    // A = R3
    turnKnob('sreg', 'AAddr', 3);
    // B = R0
    turnKnob('sreg', 'BAddr', 0);
    // C = R3
    turnKnob('sreg', 'CAddr', 3);
    // ALU = A + B
    turnKnob('salu', 'ALU', 0);

    executeCycle();
}

// Decrementa
function step2() {
    reset();

    // A = R1
    turnKnob('sreg', 'AAddr', 1);
    // B = R2
    turnKnob('sreg', 'BAddr', 2);
    // C = R1
    turnKnob('sreg', 'CAddr', 1);
    // ALU = A - B
    turnKnob('salu', 'ALU', 3);

    executeCycle();
}
