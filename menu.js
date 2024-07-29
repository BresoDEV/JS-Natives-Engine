


const BODY = document.body

//menu
var posX = 300
var posY = 10
var corFundoMenu = '#000000'
var larguraMenu = 250
var alturaMenu = 400
var opacidadeMenu = 0.9
var borderRadiusMenu = 10

//topo 
var corFundoTopoEsq = '#ff00f7'
var corFundoTopoDir = '#00ffe1'
var alturaTopo = 50
var espacamento = 5
var tamFonteTopo = 20
var fontFamilyTopo = 'impact'
var corFonteTopo = '#ffffff'

//opcoes
var tamFonteOpcoes = 13
var fontFamilyOpcoes = 'Arial'
var corFonteOpcoes = '#ffffff'
var corFundoOpcoesOver = '#ffffff'
var corFundoOpcoesTextoOver = '#000000'
var marginLeftTexto = 1
var marginRightTexto = 10

//MenuLateral
var larguraMenuLateral = 150
var corFundoMenuMenuLateral = '#000000'
var opacidadeMenuLateral = 0.7
var corFonteOpcoesLateral = '#ffffff'
var borderRadiusMenuLateral = 10
var paddingMenuLateral = 5

//nao mexer
var opcaoAtual = 0
var totalOpcoes = 0
var intervalos = []

//----------------

function BlockedOption(texto, func = () => { }) {

    var opt = addOption(() => {
        Titulo(texto )
        Texto('&#128274;')
    }, false)

    opt.addEventListener('mouseover', () => {
        var all = opt.querySelectorAll('*')
        all.forEach(element => {
            element.style.backgroundColor = 'rgb(200 100 100)'
            element.style.color = 'white'

        });
        opt.style.backgroundColor = 'rgb(200 100 100)'

        //opcaoAtual = indexopcao
    })

    opt.addEventListener('mouseleave', () => {
        var all = opt.querySelectorAll('*')
        all.forEach(element => {
            element.style.backgroundColor = corFundoMenu
            element.style.color = corFonteOpcoes
        });
        opt.style.backgroundColor = corFundoMenu

        //opcaoAtual = 0
    })
}

function SubMenu(texto, func = () => { }) {

    var bt3 = Titulo(texto)
    var bt2 = Texto('&#10132;')

    bt2.addEventListener('click', () => {
        func()
    })
    bt3.addEventListener('click', () => {
        func()
    })
}
function SubMenuBack(texto, func = () => { }) {

    var bt2 = Titulo(texto)
    var bt3 = Texto('&#10132;')
    bt3.style.transform = 'rotate(180deg)'

    bt2.addEventListener('click', () => {
        func()
    })
    bt3.addEventListener('click', () => {
        func()
    })
}



function Button(texto, func = () => { }) {

    //pai.style.paddingLeft='25%'

    const e = document.createElement('button')
    e.style.fontSize = tamFonteOpcoes + 'px'
    e.style.fontFamily = fontFamilyOpcoes
    e.style.textAlign = 'center'
    e.style.float = 'center'
    e.style.alignContent = 'center'
    e.innerHTML = texto
    e.style.color = corFonteOpcoes
    e.style.width = '100%'
    
    e.style.padding = '0px'

    e.style.marginTop = espacamento + 'px'
    e.style.marginBottom = espacamento + 'px'

    e.style.cursor = 'pointer'

    e.style.backgroundColor = 'transparent'
    e.style.border = '1px solid ' + corFonteOpcoes

    var pai = document.getElementById('opcao_' + totalOpcoes)
    pai.appendChild(e)

    e.addEventListener('click', () => {
        func()
    })




    var a = setInterval(() => {
        e.style.fontSize = tamFonteOpcoes + 'px'
        e.style.fontFamily = fontFamilyOpcoes
        e.style.marginLeft = marginLeftTexto + 'px'

        e.style.marginTop = espacamento + 'px'
        e.style.marginBottom = espacamento + 'px'
        e.style.borderRadius = borderRadiusMenu + 'px'
        e.style.height = (parseInt(tamFonteOpcoes)+5)+'px'
    }, 1);
    intervalos.push(a)

    return e;
}

function Float(variavel, min = 0, max = 100, incremento = 1.000, func = () => { }) {
    var bt1 = Texto('<')
    var bt2 = Texto(variavel)
    var bt3 = Texto('>')

    bt1.addEventListener('click', () => {
        if (variavel - incremento >= min)
            variavel -= incremento
        else
            variavel = max
        func(variavel)
    })
    bt3.addEventListener('click', () => {
        if (variavel + incremento <= max)
            variavel += incremento
        else
            variavel = min
        func(variavel)
    })
    var a = setInterval(() => {
        bt2.innerHTML = variavel.toFixed(4)
    }, 1);
    intervalos.push(a)
}

function Int(variavel, min = 0, max = 100, incremento = 1, func = () => { }) {
    var bt1 = Texto('<')
    var bt2 = Texto(variavel)
    var bt3 = Texto('>')

    bt1.addEventListener('click', () => {
        if (variavel - incremento >= min)
            variavel -= incremento
        else
            variavel = max
        func(variavel)
    })
    bt3.addEventListener('click', () => {
        if (variavel + incremento <= max)
            variavel += incremento
        else
            variavel = min
        func(variavel)
    })
    var a = setInterval(() => {
        bt2.innerHTML = variavel
    }, 1);

    intervalos.push(a)
}

function Number(variavel, min = 0, max = 100, func = () => { }) {

    const e = document.createElement('input')
    e.type = 'number'
    e.style.color = corFonteOpcoes
    e.style.marginRight = marginRightTexto + 'px'
    e.style.cursor = 'pointer'
    e.style.border = '1px solid ' + corFonteOpcoes
    e.style.width = '25%'
    e.style.textAlign = 'center'
    e.value = variavel
    e.min = min
    e.max = max
    e.style.backgroundColor = 'transparent'

    var pai = document.getElementById('opcao_' + totalOpcoes)
    pai.appendChild(e)

    e.addEventListener('input', () => {
        func(e.value)
        console.log(e.value)
    })

    var a = setInterval(() => {
        e.style.fontFamily = fontFamilyOpcoes
        e.style.marginRight = (marginRightTexto / 2) + 'px'
        e.style.height = (parseInt(tamFonteOpcoes)+5)+'px'
        e.style.padding = '0px'
    }, 1);

    intervalos.push(a)

    return e;
}


function Combo(array, func = () => { }) {

    const e = document.createElement('select')
    e.style.color = corFonteOpcoes
    e.style.marginRight = marginRightTexto + 'px'
    e.style.cursor = 'pointer'
    e.style.border = '0'
    e.style.backgroundColor = 'transparent'

    array.forEach(s => {
        var select = document.createElement('option')
        select.textContent = s
        e.appendChild(select)
    });

    var pai = document.getElementById('opcao_' + totalOpcoes)
    pai.appendChild(e)

    e.addEventListener('change', () => {
        func(e.value)
    })

    var a = setInterval(() => {
        e.style.fontFamily = fontFamilyOpcoes
        e.style.marginRight = (marginRightTexto / 2) + 'px'
        e.style.height = (parseInt(tamFonteOpcoes)+5)+'px'
        e.style.padding = '0px'
    }, 1);
    intervalos.push(a)

    return e;
}





function Color(variavel, func = () => { }) {

    const e = document.createElement('input')
    e.type = 'color'
    e.style.color = corFonteOpcoes
    e.style.marginRight = marginRightTexto + 'px'
    e.style.cursor = 'pointer'
    e.style.border = '0'
    e.style.width = '50%'
    e.value = variavel
    e.style.backgroundColor = 'transparent'


    e.addEventListener('input', () => {
        func(e.value)
        console.log(e.value)
    })

    //estilizado
    var style = document.createElement('style')
    style.innerHTML = `
    .imputsColors::-webkit-color-swatch-wrapper{
        paddin:0;
        border-radius:15px;
    }
    .imputsColors::-webkit-color-swatch{
        border:1px solid white;
        border-radius:15px;
    }
    `
    document.head.appendChild(style)
    e.className = 'imputsColors'

    var pai = document.getElementById('opcao_' + totalOpcoes)
    pai.appendChild(e)
    //------------------------

    var a = setInterval(() => {
        e.style.fontFamily = fontFamilyOpcoes
        e.style.marginRight = (marginRightTexto * 2) + 'px'

        e.style.borderRadius = '15px'
    }, 1);
    intervalos.push(a)

    return e;
}

function CheckBox(variavel, func = () => { }) {

    const e = document.createElement('input')
    e.type = 'CheckBox'
    e.style.fontSize = tamFonteOpcoes
    e.style.color = corFonteOpcoes
    e.style.marginRight = marginRightTexto + 'px'
    e.style.paddingRight = marginRightTexto + 'px'
    e.style.cursor = 'pointer'
    e.style.border = '0'
    e.style.backgroundColor = 'transparent'

    var pai = document.getElementById('opcao_' + totalOpcoes)
    pai.appendChild(e)

    //------------------------

    e.checked = variavel

    e.addEventListener('input', () => {
        func(e.checked)
    })

    var a = setInterval(() => {
        e.style.fontSize = tamFonteOpcoes + 'px'
        e.style.fontFamily = fontFamilyOpcoes
        e.style.marginRight = (marginRightTexto * 2) + 'px'// + 'px'
    }, 1);
    intervalos.push(a)

    return e;
}

function InputText(variavel, func = () => { }) {

    const e = document.createElement('input')
    e.type = 'text'
    e.style.fontSize = (tamFonteOpcoes - 3) + 'px'
    e.style.color = corFonteOpcoes
    e.style.marginRight = marginRightTexto + 'px'
    e.style.cursor = 'pointer'
    e.value = variavel
    e.style.backgroundColor = 'transparent'

    var pai = document.getElementById('opcao_' + totalOpcoes)
    pai.appendChild(e)

    e.addEventListener('input', () => {
        func(e.value)
    })

    var a = setInterval(() => {
        e.style.fontSize = (tamFonteOpcoes - 3) + 'px'
        e.style.fontFamily = fontFamilyOpcoes
        e.style.marginRight = marginRightTexto + 'px'
    }, 1);
    intervalos.push(a)

    return e;
}

function InputRangeInt(variavel, min = 0, max = 100, func = () => { }) {



    var bt2 = Texto(variavel)
    var bt3 = InputRange(variavel, min, max, (x) => {
        variavel = x
        func(variavel)
    })
    bt3.value = variavel

    var a = setInterval(() => {
        bt2.innerHTML = variavel;
    }, 1);
    intervalos.push(a)
    return bt3
}


function InputRange(variavel, min = 0, max = 100, func = () => { }) {

    const e = document.createElement('input')
    e.type = 'range'
    e.style.fontSize = tamFonteOpcoes + 'px'
    e.style.color = corFonteOpcoes
    e.style.marginRight = marginRightTexto + 'px'
    e.style.cursor = 'pointer'
    e.value = variavel
    e.min = min
    e.max = max
    e.style.backgroundColor = 'transparent'

    var pai = document.getElementById('opcao_' + totalOpcoes)
    pai.appendChild(e)

    e.addEventListener('input', () => {
        func(e.value)
    })

    var a = setInterval(() => {
        e.style.fontSize = tamFonteOpcoes + 'px'
        e.style.fontFamily = fontFamilyOpcoes
        e.style.marginRight = (marginRightTexto * 2) + 'px'

        e.style.height = (parseInt(tamFonteOpcoes)+5)+'px'
        e.style.padding = '0px'
    }, 1);

    //estilizado
    var style = document.createElement('style')
    style.innerHTML = `
    .imputs::-webkit-slider-runnable-track{
        background:#eee;
        border-radius:10px;
         
    }
    .imputs::-moz-range-track{
        background:#eee;
        border-radius:0px;
        width:3px;
    }
    `
    document.head.appendChild(style)
    e.className = 'imputs'
    //------------------------

    intervalos.push(a)

    return e;
}

function Texto(texto, func = () => { }) {

    const e = document.createElement('button')
    e.innerHTML = texto
    e.style.color = corFonteOpcoes
    e.style.cursor = 'pointer'
    e.style.backgroundColor = 'transparent'
    e.style.border = 'none'

    var pai = document.getElementById('opcao_' + totalOpcoes)
    pai.appendChild(e)

    var a = setInterval(() => {
        e.style.fontSize = tamFonteOpcoes + 'px'
        e.style.fontFamily = fontFamilyOpcoes
        e.style.marginRight = marginRightTexto + 'px'
    }, 1); intervalos.push(a)

    e.addEventListener('click', () => {
        func()
    })

    return e;
}


function BoolOnOff(variavel, func = () => { }) {

    const e = document.createElement('button')
    e.innerHTML = variavel
    e.style.color = corFonteOpcoes
    e.style.cursor = 'pointer'
    e.style.backgroundColor = 'transparent'
    e.style.border = 'none'

    var pai = document.getElementById('opcao_' + totalOpcoes)
    pai.appendChild(e)

    var a = setInterval(() => {
        e.style.fontSize = tamFonteOpcoes + 'px'
        e.style.fontFamily = 'impact'
        e.style.marginRight = marginRightTexto + 'px'

        if (variavel) {
            e.innerHTML = '<font style="color:lime">ON</font>'
        }
        else {
            e.innerHTML = '<font style="color:red">OFF</font>'
        }


    }, 1); intervalos.push(a)

    pai.addEventListener('click', () => {
        variavel = !variavel
        func(variavel)
    })

    return e;
}


function BoolCheck(variavel, func = () => { }) {

    const e = document.createElement('button')
    e.innerHTML = variavel
    e.style.color = corFonteOpcoes
    e.style.cursor = 'pointer'
    e.style.backgroundColor = 'transparent'
    e.style.border = 'none'

    var pai = document.getElementById('opcao_' + totalOpcoes)
    pai.appendChild(e)

    var a = setInterval(() => {
        e.style.fontSize = tamFonteOpcoes + 'px'
        e.style.fontFamily = 'impact'
        e.style.marginRight = marginRightTexto + 'px'

        if (variavel) {
            e.innerHTML = '<font style="color:lime">&#10004;</font>'
        }
        else {
            e.innerHTML = '<font style="color:red">&#10006;</font>'
        }


    }, 1); intervalos.push(a)

    pai.addEventListener('click', () => {
        variavel = !variavel
        func(variavel)
    })

    return e;
}

function Bool(variavel, func = () => { }) {

    const e = document.createElement('button')
    e.innerHTML = variavel
    e.style.color = corFonteOpcoes
    e.style.cursor = 'pointer'
    e.style.backgroundColor = 'transparent'
    e.style.border = 'none'

    var pai = document.getElementById('opcao_' + totalOpcoes)
    pai.appendChild(e)

    var a = setInterval(() => {
        e.style.fontSize = tamFonteOpcoes + 'px'
        e.style.fontFamily = 'impact'
        e.style.marginRight = marginRightTexto + 'px'

        if (variavel) {
            e.innerHTML = '<font style="color:lime">&#10687;</font>'
        }
        else {
            e.innerHTML = '<font style="color:red">&#10687;</font>'
        }


    }, 1); intervalos.push(a)

    pai.addEventListener('click', () => {
        variavel = !variavel
        func(variavel)
    })

    return e;
}


function Titulo(texto, func = () => { }) {

    const e = document.createElement('button')
    e.style.fontSize = tamFonteOpcoes + 'px'
    e.style.fontFamily = fontFamilyOpcoes
    e.style.textAlign = 'left'
    e.innerHTML = texto
    e.style.color = corFonteOpcoes
    e.style.width = '100%'

    e.style.margin = '0px'
    e.style.marginLeft = marginLeftTexto + 'px'

    e.style.marginTop = espacamento + 'px'
    e.style.marginBottom = espacamento + 'px'
    e.style.marginLeft = '0px'

    e.style.cursor = 'pointer'

    e.style.backgroundColor = 'transparent'
    e.style.border = 'none'

    var pai = document.getElementById('opcao_' + totalOpcoes)

    pai.appendChild(e)

    e.addEventListener('click', () => {
        func()
    })




    var a = setInterval(() => {
        e.style.fontSize = tamFonteOpcoes + 'px'
        e.style.fontFamily = fontFamilyOpcoes
        e.style.marginLeft = marginLeftTexto + 'px'

        e.style.marginTop = espacamento + 'px'
        e.style.marginBottom = espacamento + 'px'
        e.style.paddingTop = '0px'
        e.style.paddingBottom = '0px'



    }, 1); intervalos.push(a)

    return e;
}



function addBreak(text = ' ') {

    addOption(() => {
        const d = document.createElement('div')
        d.style.backgroundColor = corFundoMenu
        d.style.width = larguraMenu + 'px'
        d.style.opacity = opacidadeMenu
        d.style.cursor = 'pointer'
        d.style.display = 'flex'

        document.getElementById('Edu_menu').appendChild(d)


        if (text != ' ') {
            Titulo('<center><i>- ' + text + ' -</i></center>')
        }
        else {
            Titulo('&nbsp;')
        }


        var a = setInterval(() => {
            d.style.width = larguraMenu + 'px'
            d.style.opacity = opacidadeMenu
            d.style.backgroundColor = corFundoMenu
        }, 1); intervalos.push(a)

        return d;
    }, false)
    //totalOpcoes++

}


function addOption(func = () => { }, hoverEffect = true) {

    totalOpcoes++

    const d = document.createElement('div')
    d.style.backgroundColor = corFundoMenu
    d.style.width = larguraMenu + 'px'
    d.style.opacity = opacidadeMenu
    d.style.cursor = 'pointer'
    d.style.display = 'flex'

    d.id = 'opcao_' + totalOpcoes

    document.getElementById('Edu_menu').appendChild(d)

    var indexopcao = totalOpcoes

    if (hoverEffect) {
        d.addEventListener('mouseover', () => {
            var all = d.querySelectorAll('*')
            all.forEach(element => {
                element.style.backgroundColor = corFundoOpcoesOver
                element.style.color = corFundoOpcoesTextoOver

            });
            d.style.backgroundColor = corFundoOpcoesOver

            opcaoAtual = indexopcao
        })

        d.addEventListener('mouseleave', () => {
            var all = d.querySelectorAll('*')
            all.forEach(element => {
                element.style.backgroundColor = corFundoMenu
                element.style.color = corFonteOpcoes
            });
            d.style.backgroundColor = corFundoMenu

            opcaoAtual = 0
        })
    }



    func(d)

    var a = setInterval(() => {
        d.style.width = larguraMenu + 'px'
        d.style.opacity = opacidadeMenu


    }, 1); intervalos.push(a)

    return d;
}

function Menu(txt = 'Menu', func = () => { }) {

    if (document.getElementById('Edu_menuf')) {
        document.getElementById('Edu_menuf').remove()
        opcaoAtual = 0
        totalOpcoes = 0
        clearAllLoops()
        SaveDesign();
    }
    LoadDesign()

    const d = document.createElement('div')
    d.id = 'Edu_menuf'
    d.style.position = 'fixed'
    d.style.left = posX + 'px'
    d.style.top = posY + 'px'
    d.style.backgroundColor = corFundoMenu
    d.style.width = larguraMenu + 'px'
    //d.style.height = alturaMenu + 'px'
    d.style.opacity = opacidadeMenu
    d.style.cursor = 'pointer'
    d.style.borderRadius = '0px 0px ' + borderRadiusMenu + 'px ' + borderRadiusMenu + 'px '
    d.style.userSelect = 'none'
    BODY.appendChild(d)


    const banner = document.createElement('div')
    banner.style.background = 'linear-gradient(to right,' + corFundoTopoEsq + ',' + corFundoTopoDir + ')'
    banner.style.width = '100%'
    banner.style.textAlign = 'center'
    banner.style.paddingTop = (alturaTopo / 10) + 'px'
    banner.style.paddingBottom = (alturaTopo / 10) + 'px'
    banner.style.cursor = 'pointer'
    //banner.style.marginBottom = '10px'
    banner.style.borderRadius = '' + borderRadiusMenu + 'px ' + borderRadiusMenu + 'px 0px 0px '


    const titulo = document.createElement('font')
    titulo.style.fontSize = tamFonteTopo + 'px'
    titulo.style.fontFamily = fontFamilyTopo
    titulo.innerHTML = txt
    titulo.style.color = corFonteTopo
    titulo.style.cursor = 'pointer'

    banner.appendChild(titulo)
    d.appendChild(banner)

    const g = document.createElement('div')
    g.id = 'Edu_menu'
    //g.style.marginTop = banner.offsetHeight+'px'
    d.appendChild(g)

    //movimentacao
    var movimentar = false
    banner.addEventListener('click', () => {
        movimentar = !movimentar
        SaveDesign()
    })
    document.addEventListener('mousemove', (e) => {
        if (movimentar) {
            posX = e.clientX - (larguraMenu / 2)
            posY = e.clientY - (banner.offsetHeight / 2)
        }
    })
    //-----------------------

    
    func(d)

    //rodape

    const rodape = document.createElement('font')
    rodape.style.fontSize = (tamFonteOpcoes) + 'px'
    rodape.style.fontFamily = fontFamilyOpcoes
    rodape.innerHTML = opcaoAtual + '/' + totalOpcoes
    rodape.style.color = corFonteOpcoes
    rodape.style.cursor = 'pointer'
    rodape.style.paddingTop = '5px'
    rodape.style.paddingBottom = '5px'
    rodape.style.float = 'right'
    rodape.style.marginRight = marginRightTexto + 'px'
    rodape.style.backgroundColor = corFundoMenu
    rodape.style.opacity = opacidadeMenu
    g.appendChild(rodape)


    var style = document.createElement('style')
    style.innerHTML = `
    .scrollbar::-webkit-scrollbar{
        width:2px;
    } 
    .scrollbar::-webkit-scrollbar-thumb{
       background:${corFundoTopoDir};
       border-radius:15px;
    } 
    .scrollbar::-webkit-scrollbar-track{
       background:${corFundoTopoEsq};
    } 
    `
    document.head.appendChild(style)
    g.className = 'scrollbar'
    //

    setInterval(() => {
        d.style.left = posX + 'px'
        d.style.top = posY + 'px'
        d.style.backgroundColor = corFundoMenu
        d.style.width = larguraMenu + 'px'
        d.style.borderRadius = borderRadiusMenu + 'px'
        d.style.opacity = opacidadeMenu



        banner.style.background = 'linear-gradient(to right,' + corFundoTopoEsq + ',' + corFundoTopoDir + ')'
        banner.style.paddingTop = (alturaTopo / 10) + 'px'
        banner.style.paddingBottom = (alturaTopo / 10) + 'px'
        banner.style.borderRadius = '' + borderRadiusMenu + 'px ' + borderRadiusMenu + 'px 0px 0px '
        banner.style.width = larguraMenu + 'px'





        titulo.style.fontSize = tamFonteTopo + 'px'
        titulo.style.fontFamily = fontFamilyTopo
        titulo.innerHTML = txt
        titulo.style.color = corFonteTopo

        rodape.style.fontSize = (tamFonteOpcoes) + 'px'
        rodape.style.fontFamily = fontFamilyOpcoes
        rodape.innerHTML = opcaoAtual + '/' + totalOpcoes
        rodape.style.color = corFonteOpcoes
        rodape.style.marginRight = marginRightTexto + 'px'
        rodape.style.backgroundColor = corFundoMenu
        rodape.style.opacity = opacidadeMenu



        g.style.maxHeight = alturaMenu + 'px'

        g.style.overflowY = 'scroll'
        g.style.overflowX = 'hidden'

    }, 1);

    cLogOk('intervalos: ' + intervalos.length)
    return d;

}

function gerarID() {
    let r = "1234567890";
    let s = 'Edu_';
    for (let i = 0; i < 30; i++) {
        let ia = Math.floor(Math.random() * r.length);
        s += r.charAt(ia);
    }
    //console.log(s)
    return s;
}

function createNotepad() {

    const fundo = document.createElement('div')

    fundo.style.right = '10px'
    fundo.style.bottom = '10px'
    fundo.style.opacity = opacidadeMenu
    fundo.style.position = 'fixed'
    fundo.style.width = '200px'
    fundo.style.height = '200px'
    fundo.style.color = corFonteOpcoes
    fundo.style.position = 'fixed'
    fundo.style.backgroundColor = corFundoMenu

    fundo.style.padding = '5px'
    fundo.style.borderRadius = '5px'




    const textarea = document.createElement('textarea')

    textarea.style.width = '180px'
    textarea.style.height = '150px'
    textarea.style.marginLeft = '5px'
    textarea.style.marginTop = '5px'
    textarea.style.color = corFonteOpcoes

    textarea.style.padding = '5px'
    textarea.style.borderRadius = '5px'
    textarea.style.backgroundColor = corFundoMenu
    textarea.style.resize = 'none'

    const button = document.createElement('button')

    button.style.width = '190px'
    button.style.marginLeft = '5px'

    button.style.color = corFonteOpcoes

    button.style.padding = '5px'
    button.style.borderRadius = '5px'
    button.style.backgroundColor = corFundoMenu


    button.style.resize = 'none'
    button.textContent = 'Close'

    fundo.appendChild(textarea)
    fundo.appendChild(button)
    BODY.appendChild(fundo)

    if (localStorage.getItem('webmenu_notepad')) {
        textarea.value = localStorage.getItem('webmenu_notepad')
    }


    setInterval(() => {

        localStorage.setItem('webmenu_notepad', textarea.value)

    }, 1000);

    button.addEventListener('click', () => {
        fundo.remove()
    })

    return fundo;
}


function sideMenu(array1 = '', array2 = '') {

    if (!document.getElementById('sidemenu')) {
        const fundo2 = document.createElement('div')
        fundo2.style.backgroundColor = corFundoMenuMenuLateral

        fundo2.style.left = (posX - larguraMenu) + 'px'
        //fundo2.id = 'sideMenu' 
        fundo2.style.opacity = opacidadeMenuLateral
        fundo2.style.width = larguraMenuLateral + 'px'
        //fundo2.style.height = '100px'
        fundo2.style.color = corFonteOpcoesLateral
        fundo2.style.position = 'fixed'

        fundo2.style.padding = paddingMenuLateral + 'px'
        fundo2.style.borderRadius = borderRadiusMenuLateral + 'px'
        fundo2.id = 'sidemenu'


        const fundoTabela = document.createElement('div')

        fundo2.appendChild(fundoTabela)
        document.getElementById('Edu_menuf').appendChild(fundo2)


        let coluna = 1
        let item = 1
        let table = '<table style="width:100%">'
        for (let i = 0; i < array1.length; i++) {

            table += `
            <tr>
                <td id='Edu_${coluna}_${item}'>${array1[i]}</td>
                <td id='Edu_${coluna}_${(item + 1)}' style="float:right">${array2[i]}</td>
            </tr>
            `
            coluna++


        }
        table += '</table>'
        fundoTabela.innerHTML = table

        var a = setInterval(() => {

            fundo2.style.width = larguraMenuLateral + 'px'
            fundo2.style.opacity = opacidadeMenuLateral

            fundo2.style.backgroundColor = corFundoMenuMenuLateral
            fundo2.style.borderRadius = borderRadiusMenuLateral + 'px'
            fundo2.style.color = corFonteOpcoesLateral
            fundo2.style.padding = paddingMenuLateral + 'px'

            if (posX <= larguraMenuLateral) {

                fundo2.style.left = parseInt(posX + ((larguraMenu * 1/*nao sei pq x1,mas so funciona assim*/) + 15)) + 'px'
                fundo2.style.top = posY + 'px'
            }
            else {
                fundo2.style.left = ((posX - larguraMenuLateral) - 15) + 'px'
                fundo2.style.top = posY + 'px'
            }
        }, 1);
        intervalos.push(a)



        return fundo2
    }

}

function changeSideMenuValue(coluna, item, valor) {
    //id=''>
    if (document.getElementById('Edu_' + coluna + '_' + item)) {
        document.getElementById('Edu_' + coluna + '_' + item).innerHTML = valor
    }
}

function displayMsg(txt, tempo = 3000) {
    const fundo = document.createElement('div')
    fundo.style.backgroundColor = corFundoMenu

    fundo.style.left = '-1000px'
    fundo.style.top = '10px'
    fundo.style.opacity = '0.0'
    fundo.style.position = 'fixed'
    fundo.style.color = corFonteOpcoes

    fundo.style.padding = '20px'
    fundo.innerHTML = txt
    fundo.style.borderRadius = '10px'
    fundo.style.display = 'none'


    BODY.appendChild(fundo)

    var ct = 11;
    var loopis = setInterval(() => {
        fundo.style.left = '10px'
        fundo.style.opacity = '0.' + ct
        fundo.style.display = 'block'
        if (ct == 77) {
            setTimeout(() => {
                var loopis2 = setInterval(() => {
                    fundo.style.left = '10px'
                    fundo.style.opacity = '0.' + ct
                    fundo.style.display = 'block'
                    if (ct == 10) {
                        fundo.remove()
                        clearInterval(loopis)
                        clearInterval(loopis2)
                    }
                    else {
                        ct--
                    }
                }, 10);
            }, tempo);
        }
        else {
            ct++
        }
    }, 10);
}

function displayImage(src = '1.jpg', x = 10, y = 10, w = 200, h = 200, moveable = false) {
    const fundo = document.createElement('img')
    fundo.style.left = x + 'px'
    fundo.style.top = y + 'px'
    fundo.style.position = 'fixed'

    fundo.style.width = w + 'px'
    fundo.style.height = h + 'px'
    fundo.id = gerarID()

    fundo.src = src
    document.getElementById('Edu_menuf').appendChild(fundo)
    if (moveable) {
        makeElementMoveable(fundo)
    }
    return fundo
}

function makeElementMoveable(element) {
    let x, y
    var move = false
    element.addEventListener('click', (e) => {
        move = !move
    })
    document.addEventListener('mousemove', (e) => {
        if (move) {
            x = e.clientX - (element.offsetWidth / 2)
            y = e.clientY - (element.offsetHeight / 2)
        }
    })
    var a = setInterval(() => {
        if (move && element) {
            element.style.left = x + 'px'
            element.style.top = y + 'px'
            element.style.cursor = 'pointer'
        }
    }, 1); intervalos.push(a)
}

function cLog(msg) {
    if (exibirLogs) { console.log(msg); }
}
function cLogOk(msg) {
    console.log('%c' + msg, 'color:green');
}
function cLogErro(msg) {
    console.log('%c' + msg, 'color:red');
}

function clearAllLoops() {
    intervalos.forEach(element => {
        clearInterval(element)
    });
    intervalos = []
}


function unload() {
    if (document.getElementById('Edu_menuf')) {
        document.getElementById('Edu_menuf').remove()
        opcaoAtual = 0
        totalOpcoes = 0
        clearAllLoops()
        cLogOk('Menu removido')
    }

}

//Mensagem.Show('<font style="color:lime">Menu injected</font><br>Press <font style="color:yellow">' + teclaAbrir + '</font> to open/close menu')
cLogOk('Menu injetado com sucesso!')


function SaveDesign() {
    localStorage.setItem('Menu_posX', posX)
    localStorage.setItem('Menu_posY', posY)
    localStorage.setItem('Menu_corFundoMenu', corFundoMenu)
    localStorage.setItem('Menu_larguraMenu', larguraMenu)
    localStorage.setItem('Menu_alturaMenu', alturaMenu)
    localStorage.setItem('Menu_opacidadeMenu', opacidadeMenu)
    localStorage.setItem('Menu_borderRadiusMenu', borderRadiusMenu)
    localStorage.setItem('Menu_corFundoTopoEsq', corFundoTopoEsq)
    localStorage.setItem('Menu_corFundoTopoDir', corFundoTopoDir)
    localStorage.setItem('Menu_alturaTopo', alturaTopo)
    localStorage.setItem('Menu_espacamento', espacamento)
    localStorage.setItem('Menu_tamFonteTopo', tamFonteTopo)
    localStorage.setItem('Menu_fontFamilyTopo', fontFamilyTopo)
    localStorage.setItem('Menu_corFonteTopo', corFonteTopo)
    localStorage.setItem('Menu_tamFonteOpcoes', tamFonteOpcoes)
    localStorage.setItem('Menu_fontFamilyOpcoes', fontFamilyOpcoes)
    localStorage.setItem('Menu_corFonteOpcoes', corFonteOpcoes)
    localStorage.setItem('Menu_corFundoOpcoesOver', corFundoOpcoesOver)
    localStorage.setItem('Menu_corFundoOpcoesTextoOver', corFundoOpcoesTextoOver)
    localStorage.setItem('Menu_marginLeftTexto', marginLeftTexto)
    localStorage.setItem('Menu_marginRightTexto', marginRightTexto)
    localStorage.setItem('Menu_larguraMenuLateral', larguraMenuLateral)
    localStorage.setItem('Menu_corFundoMenuMenuLateral', corFundoMenuMenuLateral)
    localStorage.setItem('Menu_opacidadeMenuLateral', opacidadeMenuLateral)
    localStorage.setItem('Menu_corFonteOpcoesLateral', corFonteOpcoesLateral)
    localStorage.setItem('Menu_borderRadiusMenuLateral', borderRadiusMenuLateral)
    localStorage.setItem('Menu_paddingMenuLateral', paddingMenuLateral)
}
function LoadDesign() {
    if (localStorage.getItem('Menu_posX')) { posX = localStorage.getItem('Menu_posX') }
    if (localStorage.getItem('Menu_posY')) { posY = localStorage.getItem('Menu_posY') }
    if (localStorage.getItem('Menu_corFundoMenu')) { corFundoMenu = localStorage.getItem('Menu_corFundoMenu') }
    if (localStorage.getItem('Menu_larguraMenu')) { larguraMenu = localStorage.getItem('Menu_larguraMenu') }
    if (localStorage.getItem('Menu_alturaMenu')) { alturaMenu = localStorage.getItem('Menu_alturaMenu') }
    if (localStorage.getItem('Menu_opacidadeMenu')) { opacidadeMenu = localStorage.getItem('Menu_opacidadeMenu') }
    if (localStorage.getItem('Menu_borderRadiusMenu')) { borderRadiusMenu = localStorage.getItem('Menu_borderRadiusMenu') }
    if (localStorage.getItem('Menu_corFundoTopoEsq')) { corFundoTopoEsq = localStorage.getItem('Menu_corFundoTopoEsq') }
    if (localStorage.getItem('Menu_corFundoTopoDir')) { corFundoTopoDir = localStorage.getItem('Menu_corFundoTopoDir') }
    if (localStorage.getItem('Menu_alturaTopo')) { alturaTopo = localStorage.getItem('Menu_alturaTopo') }
    if (localStorage.getItem('Menu_espacamento')) { espacamento = localStorage.getItem('Menu_espacamento') }
    if (localStorage.getItem('Menu_tamFonteTopo')) { tamFonteTopo = localStorage.getItem('Menu_tamFonteTopo') }
    if (localStorage.getItem('Menu_fontFamilyTopo')) { fontFamilyTopo = localStorage.getItem('Menu_fontFamilyTopo') }
    if (localStorage.getItem('Menu_corFonteTopo')) { corFonteTopo = localStorage.getItem('Menu_corFonteTopo') }
    if (localStorage.getItem('Menu_tamFonteOpcoes')) { tamFonteOpcoes = localStorage.getItem('Menu_tamFonteOpcoes') }
    if (localStorage.getItem('Menu_fontFamilyOpcoes')) { fontFamilyOpcoes = localStorage.getItem('Menu_fontFamilyOpcoes') }
    if (localStorage.getItem('Menu_corFonteOpcoes')) { corFonteOpcoes = localStorage.getItem('Menu_corFonteOpcoes') }
    if (localStorage.getItem('Menu_corFundoOpcoesOver')) { corFundoOpcoesOver = localStorage.getItem('Menu_corFundoOpcoesOver') }
    if (localStorage.getItem('Menu_corFundoOpcoesTextoOver')) { corFundoOpcoesTextoOver = localStorage.getItem('Menu_corFundoOpcoesTextoOver') }
    if (localStorage.getItem('Menu_marginLeftTexto')) { marginLeftTexto = localStorage.getItem('Menu_marginLeftTexto') }
    if (localStorage.getItem('Menu_marginRightTexto')) { marginRightTexto = localStorage.getItem('Menu_marginRightTexto') }
    if (localStorage.getItem('Menu_larguraMenuLateral')) { larguraMenuLateral = localStorage.getItem('Menu_larguraMenuLateral') }
    if (localStorage.getItem('Menu_corFundoMenuMenuLateral')) { corFundoMenuMenuLateral = localStorage.getItem('Menu_corFundoMenuMenuLateral') }
    if (localStorage.getItem('Menu_opacidadeMenuLateral')) { opacidadeMenuLateral = localStorage.getItem('Menu_opacidadeMenuLateral') }
    if (localStorage.getItem('Menu_corFonteOpcoesLateral')) { corFonteOpcoesLateral = localStorage.getItem('Menu_corFonteOpcoesLateral') }
    if (localStorage.getItem('Menu_borderRadiusMenuLateral')) { borderRadiusMenuLateral = localStorage.getItem('Menu_borderRadiusMenuLateral') }
    if (localStorage.getItem('Menu_paddingMenuLateral')) { paddingMenuLateral = localStorage.getItem('Menu_paddingMenuLateral') }

}

function resetLayout() {

    corFundoMenu = '#000000'
    larguraMenu = 350
    alturaMenu = 400
    opacidadeMenu = 0.9
    borderRadiusMenu = 10
    corFundoTopoEsq = '#ff00f7'
    corFundoTopoDir = '#00ffe1'
    alturaTopo = 50
    espacamento = 5
    tamFonteTopo = 20
    fontFamilyTopo = 'impact'
    corFonteTopo = '#ffffff'

    tamFonteOpcoes = 13
    fontFamilyOpcoes = 'Arial'
    corFonteOpcoes = '#ffffff'
    corFundoOpcoesOver = '#ffffff'
    corFundoOpcoesTextoOver = '#000000'
    marginLeftTexto = 1
    marginRightTexto = 10

    larguraMenuLateral = 350
    corFundoMenuMenuLateral = '#000000'
    opacidadeMenuLateral = 0.7
    corFonteOpcoesLateral = '#ffffff'
    borderRadiusMenuLateral = 10
    paddingMenuLateral = 5
    SaveDesign()
}

function logVars() {
    console.clear()
    console.log('posX = ' + posX)
    console.log('posY = ' + posY)
    console.log('corFundoMenu = ' + corFundoMenu)
    console.log('larguraMenu = ' + larguraMenu)
    console.log('alturaMenu = ' + alturaMenu)
    console.log('opacidadeMenu = ' + opacidadeMenu)
    console.log('borderRadiusMenu = ' + borderRadiusMenu)
    console.log('corFundoTopoEsq = ' + corFundoTopoEsq)
    console.log('corFundoTopoDir = ' + corFundoTopoDir)
    console.log('alturaTopo = ' + alturaTopo)
    console.log('espacamento = ' + espacamento)
    console.log('tamFonteTopo = ' + tamFonteTopo)
    console.log('fontFamilyTopo = ' + fontFamilyTopo)
    console.log('corFonteTopo = ' + corFonteTopo)
    console.log('tamFonteOpcoes = ' + tamFonteOpcoes)
    console.log('fontFamilyOpcoes = ' + fontFamilyOpcoes)
    console.log('corFonteOpcoes = ' + corFonteOpcoes)
    console.log('corFundoOpcoesOver = ' + corFundoOpcoesOver)
    console.log('corFundoOpcoesTextoOver = ' + corFundoOpcoesTextoOver)
    console.log('marginLeftTexto = ' + marginLeftTexto)
    console.log('marginRightTexto = ' + marginRightTexto)
    console.log('larguraMenuLateral = ' + larguraMenuLateral)
    console.log('corFundoMenuMenuLateral = ' + corFundoMenuMenuLateral)
    console.log('opacidadeMenuLateral = ' + opacidadeMenuLateral)
    console.log('corFonteOpcoesLateral = ' + corFonteOpcoesLateral)
    console.log('borderRadiusMenuLateral = ' + borderRadiusMenuLateral)
    console.log('paddingMenuLateral = ' + paddingMenuLateral)
}

const Funcoes = {
    removerCSS() {
        var estilo = document.querySelectorAll('style')
        estilo.forEach(element => {
            element.remove()
        });
        cLogOk('CSS removido')
    },
    removerScript() {
        var estilo = document.querySelectorAll('script')
        estilo.forEach(element => {
            element.remove()
        });
        cLogOk('Scripts removido')
    }
}

var tag_estilo = document.createElement('style')
tag_estilo.innerHTML=`
button{
    margin:0px;
}
`
BODY.append(tag_estilo)


//nao implementado
function displayCanvas(x = 10, y = 10, w = 200, h = 200) {
    const fundo = document.createElement('canvas')
    fundo.style.left = x + 'px'
    fundo.style.top = y + 'px'
    fundo.style.position = 'fixed'

    fundo.style.width = w + 'px'
    fundo.style.height = h + 'px'
    //fundo.style.backgroundColor = 'red'
    fundo.style.zIndex = '-1'
    fundo.id = gerarID()
 
    BODY.appendChild(fundo)


    var ctx = fundo.getContext('2d')
    ctx.strokeStyle = 'red'
    ctx.beginPath()
    ctx.moveTo(0,h/2)
    ctx.lineTo(w/2,h/2)
    ctx.stroke()
    makeElementMoveable(fundo)
    
    return fundo
}

