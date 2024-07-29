let prevPositions = {};//SAVE_ENTITY_COORDS e RESTORE_ENTITY_COORDS
var contador_de_botoes_celular = 10 //ADD_MOBILE_BUTTON
var teveInteracao = false//CREATE_AUDIO
var FLIP_PLAYER = false;
var touchstartX = 0;//GET_TOUCH_X_COORD()
var touchstartY = 0;//GET_TOUCH_Y_COORD()
var hooks = []; //armazena todos hooks criados
var HOOKS_RUNNING = 0;//armazena a quantidade de loops rodando

//CREATE_AUDIO events pra liberar o play
document.body.addEventListener('click', () => {
    teveInteracao = true
})
document.body.addEventListener('touchstart', () => {
    teveInteracao = true
})
document.body.addEventListener('keydown', () => {
    teveInteracao = true
})
//====================
//logs
function cLog(txt) {
    console.log(txt)
}
function clog(txt) {
    console.log(txt)
}

//----------------

const bloquearDivsAzul = document.createElement('style')
bloquearDivsAzul.innerHTML = `
*{
    -webkit-tap-highlight-color: transparent;
        -webkit-touch-callout: none;
}`
document.head.appendChild(bloquearDivsAzul)

//------------

var estaComODedoNaTela = false

document.body.addEventListener('touchstart', () => {
    estaComODedoNaTela = true
})
document.body.addEventListener('touchend', () => {
    estaComODedoNaTela = false
})

//------------



const ENTITY = {
    DRAW_LINE_ON_ENTITY(entity, tam, color) {
        if (ENTITY.DOES_ENTITY_EXIST(entity)) {

            var v = GRAPHICS.DRAW_VERT_LINE(ENTITY.GET_ENTITY_CENTER_X_COORD_ON_SCREEN(entity), tam, color)
            var h = GRAPHICS.DRAW_HORIZON_LINE(ENTITY.GET_ENTITY_CENTER_Y_COORD_ON_SCREEN(entity), tam, color)
            var loop = setInterval(() => {
                h.style.top = ENTITY.GET_ENTITY_CENTER_Y_COORD_ON_SCREEN(entity) + 'px';
                v.style.left = ENTITY.GET_ENTITY_CENTER_X_COORD_ON_SCREEN(entity) + 'px';

            }, 1);
            hooks.push(loop)
        }
    },
    SET_ENTITY_VISIBLE(entity, bool) {
        if (ENTITY.DOES_ENTITY_EXIST(entity)) {
            if (bool) {
                entity.style.display = 'block'
            }
            else {
                entity.style.display = 'none'
            }
        }
    },
    GET_DISTANCE_BETWEEN_ENTITYS(entity1, entity2) {

        var x = ENTITY.GET_ENTITY_CENTER_X_COORD(entity1) - ENTITY.GET_ENTITY_CENTER_X_COORD(entity2)
        var y = ENTITY.GET_ENTITY_CENTER_Y_COORD(entity1) - ENTITY.GET_ENTITY_CENTER_Y_COORD(entity2)
        if (x < 0) {
            x = (x * -1)
        }
        if (y < 0) {
            y = (y * -1)
        }
        return Math.floor(parseInt(x + y))

    },
    SET_ENTITY_NO_LONGER_NEEDED(entity) {
        var loop = setInterval(() => {
            if (!ENTITY.IS_VISIBLE(entity)) {
                setTimeout(() => {
                    ENTITY.DELETE_ENTITY(entity)
                    clearInterval(loop)
                }, 2000);
            }
        }, 1000);
        hooks.push(loop)

    },
    SET_AS_ENEMY(entity, followPlayer = false) {
        if (ENTITY.DOES_ENTITY_EXIST(entity)) {
            entity.id = entity.id + ' inimigo_' + FUNCTIONS.GET_RANDON_INT(0, 5000)
            if (followPlayer) {
                var jameviu = false
                var loopis = setInterval(() => {
                    if (ENTITY.DOES_ENTITY_EXIST(entity)) {
                        if (ENTITY.IS_VISIBLE(entity)) {
                            jameviu = true
                        }
                        if (jameviu) {
                            var x = ENTITY.GET_ENTITY_X_COORD(PLAYER.PLAYER_PED_ID())
                            var y = ENTITY.GET_ENTITY_Y_COORD(PLAYER.PLAYER_PED_ID())
                            ENTITY.MOVE_ENTITY_TO_COORDS_WITH_DELAY(entity, x, y, 5)
                        }
                    }
                    else {
                        clearInterval(loopis)
                    }

                }, 1);
                hooks.push(loopis)
            }
        }
    },
    SET_AS_FRIEND(entity) {
        if (ENTITY.DOES_ENTITY_EXIST(entity)) {
            entity.id = entity.id + ' amigo_' + FUNCTIONS.GET_RANDON_INT(0, 5000)

        }
    },


    GET_ENTITY_COLLIDED(entity) {
        var blocos = MAP.GET_MAP().querySelectorAll('*')
        var cu = null
        blocos.forEach(e => {
            if (e.id.includes('bloco_')) {
                if (ENTITY.IS_ENTITY_COLLIDED_TO_ENTITY(entity, e)) {
                    cu = e;
                }
            }
        });
        return cu
    },
    DESTROY_ENTITY_WHEN_COLLIDE_TO_ANY_ENTITY(entity) {
        var loop = setInterval(() => {
            if (ENTITY.DOES_ENTITY_EXIST(entity)) {
                if (ENTITY.IS_ENTITY_COLLIDED_TO_ANY_COLLISION_BLOCK(entity)) {
                    ENTITY.DELETE_ENTITY(bala)
                    clearInterval(loop)
                }
            }
            else {
                ENTITY.DELETE_ENTITY(bala)
                clearInterval(loop)
            }
        }, 1);
        hooks.push(loop)
    },
    MAKE_ENTITY_FOLLOW_PLAYER(entity, speed = 5, infinite = false) {
        if (ENTITY.DOES_ENTITY_EXIST(entity)) {
            if (infinite) {
                var loopis = setInterval(() => {
                    if (ENTITY.DOES_ENTITY_EXIST(entity)) {
                        var x = ENTITY.GET_ENTITY_X_COORD(PLAYER.PLAYER_PED_ID())
                        var y = ENTITY.GET_ENTITY_Y_COORD(PLAYER.PLAYER_PED_ID())
                        ENTITY.MOVE_ENTITY_TO_COORDS_WITH_DELAY(entity, x, y, speed)
                    }
                    else {
                        clearInterval(loopis)
                    }

                }, speed);
                hooks.push(loopis)
            }
            else {
                var x = ENTITY.GET_ENTITY_CENTER_X_COORD(PLAYER.PLAYER_PED_ID())
                var y = ENTITY.GET_ENTITY_CENTER_Y_COORD(PLAYER.PLAYER_PED_ID())
                ENTITY.MOVE_ENTITY_TO_COORDS_WITH_DELAY(entity, x, y, speed)
            }
        } else {
            clog('entity nao existe')
        }
    },
    MAKE_ENTITY_FOLLOW_ENTITY(entity, entity2, speed = 5, infinite = false) {
        if (ENTITY.DOES_ENTITY_EXIST(entity)) {
            if (infinite) {
                var loopis = setInterval(() => {
                    if (ENTITY.DOES_ENTITY_EXIST(entity) && ENTITY.DOES_ENTITY_EXIST(entity2)) {
                        var x = ENTITY.GET_ENTITY_X_COORD(entity2)
                        var y = ENTITY.GET_ENTITY_Y_COORD(entity2)
                        ENTITY.MOVE_ENTITY_TO_COORDS_WITH_DELAY(entity, x, y, speed)
                    } else {
                        clearInterval(loopis)
                    }
                }, speed);
                hooks.push(loopis)
            }
            else {
                var x = ENTITY.GET_ENTITY_CENTER_X_COORD(entity2)
                var y = ENTITY.GET_ENTITY_CENTER_Y_COORD(entity2)
                ENTITY.MOVE_ENTITY_TO_COORDS_WITH_DELAY(entity, x, y, speed)
            }
        }
        else {
            clog('entity nao existe')
        }
    },
    SHOOT_ENTITY(textura, w, h, entity, velocidade) {
        if (ENTITY.DOES_ENTITY_EXIST(entity)) {
            var x = ENTITY.GET_ENTITY_CENTER_X_COORD(entity)
            var y = ENTITY.GET_ENTITY_CENTER_Y_COORD(entity)
            FUNCTIONS.CREATE_SHOOT_TO_COORD(textura, w, h, x, y, velocidade, true)
        }
        else {
            clog('alvo nao existe')
        }
    },
    SAVE_ENTITY_COORDS(entity) {
        prevPositions[entity.id] = {
            top: entity.style.top,
            left: entity.style.left
        };
    },
    RESTORE_ENTITY_COORDS(entity) {
        if (prevPositions[entity.id]) {
            entity.style.top = prevPositions[entity.id].top;
            entity.style.left = prevPositions[entity.id].left;
        }
    },
    IS_ENTITY_COLLIDED_TO_ANY_COLLISION_BLOCK(entity) {
        var blocos = MAP.GET_MAP().querySelectorAll('*')
        var colidiu = false
        blocos.forEach(e => {
            if (e.id.includes('bloco_')) {
                if (ENTITY.IS_ENTITY_COLLIDED_TO_ENTITY(entity, e)) {
                    colidiu = true
                }
            }
        });
        return colidiu;
    },
    ADD_COLLISION_TO_ENTITY(entity) {
        if (ENTITY.DOES_ENTITY_EXIST(entity)) {
            if (entity !== PLAYER.PLAYER_PED_ID()) {
                entity.id = entity.id + ' bloco_' + FUNCTIONS.GET_RANDON_INT(0, 5000)
            }
            else {
                console.log('Colisao ignorada ao PLAYER_PED_ID()')
            }
        }
    },
    IS_VISIBLE(entity) {
        if (ENTITY.DOES_ENTITY_EXIST(entity)) {
            const rect = entity.getBoundingClientRect()
            const isV = (rect.top >= 0 &&
                rect.left >= 0 &&
                rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
                rect.right <= (window.innerWidth || document.documentElement.clientWidth))
            return isV
        }
        return false
    },
    SET_ENTITY_ON_SCREEN_CENTER(obj) {
        var alturaTela = window.innerHeight
        var larguraTela = window.innerWidth
        var alturaObj = obj.clientHeight
        var larguraObj = obj.clientWidth
        obj.style.left = Math.floor(larguraTela / 2) - Math.floor(larguraObj / 2) + 'px'
        obj.style.top = Math.floor(alturaTela / 2) - Math.floor(alturaObj / 2) + 'px'
    },
    SET_ENTITY_SIZE(entity, x, y) {
        if (ENTITY.DOES_ENTITY_EXIST(entity)) {
            var item = ENTITY.GET_ENTITY(entity);

            x = x.toString();
            y = y.toString();

            if (x.includes('px'))
                item.style.width = x;
            else
                item.style.width = x + 'px';
            //-----------
            if (y.includes('px'))
                item.style.height = y;
            else
                item.style.height = y + 'px';
        }
    },
    SET_ENTITY_TEXTURE(entity, textura) {
        if (ENTITY.DOES_ENTITY_EXIST(entity)) {
            var item = ENTITY.GET_ENTITY(entity);
            item.src = textura;
        }
    },
    GET_ENTITY_ALPHA(entity) {
        if (ENTITY.DOES_ENTITY_EXIST(entity)) {
            var item = ENTITY.GET_ENTITY(entity);
            return item.style.opacity;
        }
    },
    SET_ENTITY_ALPHA(entity, alpha) {
        var item = ENTITY.GET_ENTITY(entity);
        if (parseInt(alpha) === 100)
            item.style.opacity = '1';
        else if (parseInt(alpha) < 10)
            item.style.opacity = '0.0' + alpha;
        else
            item.style.opacity = '0.' + alpha;
    },
    SET_ENTITY_ROTATION(entity, angulo) {
        var item = ENTITY.GET_ENTITY(entity);
        angulo = parseInt(angulo);
        item.style.transition = 'transform 0.0s linear';
        item.style.transform = 'rotate(' + angulo + 'deg)';
    },
    GET_ENTITY_ROTATION(entity) {
        var estilo = window.getComputedStyle(ENTITY.GET_ENTITY(entity));
        var mt = new DOMMatrix(estilo.transform);
        var angulo = Math.atan2(mt.b, mt.a) * (180 / Math.PI);
        if (angulo < 0) {
            angulo += 360;
        }
        return parseInt(angulo.toFixed());
    }
    ,
    SET_ENTITY_BACKCOLOR(entity, color) {
        if (ENTITY.DOES_ENTITY_EXIST(entity)) {
            var item = ENTITY.GET_ENTITY(entity);
            item.style.backgroundColor = color;
        }
    },
    DELETE_ENTITY(entity) {
        entity.remove();
    },
    GET_ENTITY(entity) {
        if (document.getElementById(entity))
            var item = document.getElementById(entity);
        else
            var item = entity;

        return item;
    },
    MOVE_ENTITY_TO_COORDS_WITH_DELAY(npcID, x, y, tempo = 1, tipo = 'linear') {
        /*
        Exemplo:
         ENTITY.MOVE_ENTITY_TO_COORDS_WITH_DELAY(inimigo, '300', '300');
    setInterval(() => {
            ENTITY.MOVE_ENTITY_TO_COORDS_WITH_DELAY(inimigo, ENTITY.GET_ENTITY_X_COORD(player), ENTITY.GET_ENTITY_Y_COORD(player));
        }, 1000);

        */
        var npc = ENTITY.GET_ENTITY(npcID);

        x = parseInt(x);
        y = parseInt(y);


        npc.style.transition = 'all ' + tempo + '.0s ' + tipo + '';
        //setTimeout(() => {
        npc.style.top = y + 'px';
        npc.style.left = x + 'px';


        //}, 10);
    },
    GET_ENTITY_SIZE(item) {
        //ENTITY.GET_ENTITY_SIZE(item).x     ou      ENTITY.GET_ENTITY_SIZE(item).y

        var posicoes = {
            x: item.offsetWidth,
            y: item.offsetHeight
        }
        return posicoes;
    },
    GET_ENTITY_X_COORD(plyr) {
        return (MAP.GET_MAP().getBoundingClientRect().left * -1) + plyr.getBoundingClientRect().left
    }
    ,
    GET_ENTITY_Y_COORD(plyr) {
        return (MAP.GET_MAP().getBoundingClientRect().top * -1) + plyr.getBoundingClientRect().top
    }
    ,
    GET_ENTITY_CENTER_X_COORD(plyr) {
        return ENTITY.GET_ENTITY_X_COORD(plyr) + (plyr.offsetWidth / 2)
    },
    GET_ENTITY_CENTER_Y_COORD(plyr) {
        return ENTITY.GET_ENTITY_Y_COORD(plyr) + (plyr.offsetHeight / 2)
    }
    ,


    GET_ENTITY_X_COORD_ON_SCREEN(plyr) {//retorna a posicao relatiiva a tela, e nao a real
        return (parseInt(plyr.offsetLeft))
    }
    ,
    GET_ENTITY_Y_COORD_ON_SCREEN(plyr) {//retorna a posicao relatiiva a tela, e nao a real
        return (parseInt(plyr.offsetTop) /*+ parseInt(MAP.GET_MAP().offsetTop)*/)
    },

    GET_ENTITY_CENTER_X_COORD_ON_SCREEN(plyr) {//retorna a posicao relatiiva a tela, e nao a real
        return ENTITY.GET_ENTITY_X_COORD_ON_SCREEN(plyr) + parseInt(plyr.offsetWidth / 2)
    }
    ,
    GET_ENTITY_CENTER_Y_COORD_ON_SCREEN(plyr) {//retorna a posicao relatiiva a tela, e nao a real
        return ENTITY.GET_ENTITY_Y_COORD_ON_SCREEN(plyr) + parseInt(plyr.offsetHeight / 2)
    },


    DOES_ENTITY_EXIST(entity) {
        if (typeof (entity) === 'object')
            return entity.isConnected;
        else if (typeof (entity) === 'string')
            return document.getElementById(entity);
    },
    IS_ENTITY_COLLIDED_TO_ENTITY(el1, el2) {
        const rect1 = el1.getBoundingClientRect();
        const rect2 = el2.getBoundingClientRect();

        return !(rect1.right < rect2.left ||
            rect1.left > rect2.right ||
            rect1.bottom < rect2.top ||
            rect1.top > rect2.bottom);
    },
    IS_ENTITY_NEAR_ENTITY(e1, e2, radius = 5) {
        var e1offsetLeft = ENTITY.GET_ENTITY_X_COORD(e1)
        var e1offsetTop = ENTITY.GET_ENTITY_Y_COORD(e1)
        var e2offsetLeft = ENTITY.GET_ENTITY_X_COORD(e2)
        var e2offsetTop = ENTITY.GET_ENTITY_Y_COORD(e2)
        if (e1offsetLeft >= (e2offsetLeft - radius) &&
            e1offsetLeft <= (e2offsetLeft + e2.offsetWidth) + radius ||
            e2offsetLeft >= e1offsetLeft + radius &&
            e2offsetLeft <= ((e1offsetLeft + e1.offsetWidth) + radius)) {
            if (e1offsetTop >= e2offsetTop - radius &&
                e1offsetTop <= (e2offsetTop + e2.offsetHeight) + radius ||
                e2offsetTop >= e1offsetTop + radius &&
                e2offsetTop <= (e1offsetTop + e1.offsetHeight) + radius) {
                return true

            }
        }
        return false
    },
    IS_ENTITY_AT_COORD(plyr, x, y, radius) {
        var px = ENTITY.GET_ENTITY_CENTER_X_COORD(plyr)
        var py = ENTITY.GET_ENTITY_CENTER_Y_COORD(plyr)
        if (px >= (x - radius)) {
            if (px <= (x + radius)) {
                if (py >= (y - radius)) {
                    if (py <= (y + radius)) {
                        return true
                    }
                }
            }
        }
        return false
    },


    SET_ENTITY_COORD(entity, x, y) {
        if (ENTITY.DOES_ENTITY_EXIST(entity)) {
            ENTITY.GET_ENTITY(entity).style.left = x + 'px'
            ENTITY.GET_ENTITY(entity).style.top = y + 'px'
        }
    }


}

const MAP = {
    DRAW_MINIMAP(OpenKey = 'm') {

        document.body.addEventListener('keydown', (e) => {
            if (e.key == OpenKey) {

                if (!ENTITY.DOES_ENTITY_EXIST('mapview')) {
                    const mapview = document.createElement('img')
                    mapview.src = MAP.GET_MAP_IMG()
                    mapview.style.position = 'absolute'
                    mapview.style.width = '80%'
                    mapview.style.height = '60%'
                    mapview.style.left = '10%'
                    mapview.style.top = '20%'
                    mapview.style.borderRadius = '3%'
                    mapview.style.border = '5px solid black'
                    mapview.id = 'mapview'
                    document.body.appendChild(mapview)
                }
                else {
                    ENTITY.DELETE_ENTITY(ENTITY.GET_ENTITY('mapview'))
                }

            }

        });

    },
    SET_MAP_IMG(src) {
        if (document.getElementById('imgfundo')) {
            document.getElementById('imgfundo').src = src
        }
        else {
            console.log('Mapa nao encontrado')
        }

    },
    GET_MAP_IMG() {
        if (document.getElementById('imgfundo')) {
            return document.getElementById('imgfundo').src
        }
        return 'Mapa nao encontrado'
    },
    GET_MAP() {
        return document.getElementById('fundo')
    },
    GET_Y_MAP_SIZE() {
        return MAP.GET_MAP().clientHeight
    },
    GET_X_MAP_SIZE() {
        return MAP.GET_MAP().clientWidth
    },
    DRAW_MAP(src, w, h) {
        if (!ENTITY.DOES_ENTITY_EXIST('fundo')) {
            const fundo = document.createElement('div')
            fundo.style.position = 'fixed'
            fundo.style.width = w + 'px'
            fundo.style.height = h + 'px'
            fundo.style.top = '0px'
            fundo.style.left = '0px'
            fundo.id = 'fundo'

            const img = document.createElement('img')
            img.src = src
            img.style.position = 'absolute'
            img.style.width = '100%'
            img.style.height = '100%'
            img.style.left = '0px'
            img.style.top = '0px'
            img.id = 'imgfundo'
            fundo.appendChild(img)
            document.body.appendChild(fundo)
            return fundo
        }
    },
    GET_DISTANCE_BETWEEN_COORDS(x1, y1, x2, y2) {
        var x = x1 - x2
        var y = y1 - y2
        if (x < 0) { x = (x * -1) }
        if (y < 0) { y = (y * -1) }
        return Math.floor(parseInt(x + y))

    }
}

const PLAYER = {
    CREATE_PLAYER(src, x, y, w, h) {
        if (!PLAYER.PLAYER_PED_ID()) {
            const img = document.createElement('img')
            img.src = src
            img.id = 'PLAYER_PED_ID'
            img.style.position = 'absolute'
            img.style.width = w + 'px'
            img.style.height = h + 'px'
            img.style.left = x + 'px'
            img.style.top = y + 'px'
            document.body.appendChild(img)
            //MAP.GET_MAP().appendChild(img)
            return img;
        }
    },
    PLAYER_PED_ID() {
        if (document.getElementById('PLAYER_PED_ID')) {
            return document.getElementById('PLAYER_PED_ID')
        }
    },
    MOVE_PLAYER_RIGHT(pixels) {
        if ((MAP.GET_MAP().offsetLeft - pixels) >= ((MAP.GET_MAP().offsetWidth - window.innerWidth) * -1)) {
            MAP.GET_MAP().style.left = (MAP.GET_MAP().offsetLeft - pixels) + 'px'
        }
        else {
            var limite = window.innerWidth - PLAYER.PLAYER_PED_ID().offsetWidth

            if ((PLAYER.PLAYER_PED_ID().offsetLeft + pixels) <= limite) {
                PLAYER.PLAYER_PED_ID().style.left = (PLAYER.PLAYER_PED_ID().offsetLeft + pixels) + 'px'
            }
        }
    },
    MOVE_PLAYER_LEFT(pixels) {
        if ((MAP.GET_MAP().offsetLeft + pixels) <= 0) {
            MAP.GET_MAP().style.left = (MAP.GET_MAP().offsetLeft + pixels) + 'px'

        }
        else {
            if ((PLAYER.PLAYER_PED_ID().offsetLeft - pixels) >= 0) {
                PLAYER.PLAYER_PED_ID().style.left = (PLAYER.PLAYER_PED_ID().offsetLeft - pixels) + 'px'

            }
        }
    },
    MOVE_PLAYER_UP(pixels) {
        if ((MAP.GET_MAP().offsetTop + pixels) <= 0) {
            MAP.GET_MAP().style.top = (MAP.GET_MAP().offsetTop + pixels) + 'px'
        }
        else {
            if ((PLAYER.PLAYER_PED_ID().offsetTop - pixels) >= 0) {
                PLAYER.PLAYER_PED_ID().style.top = (PLAYER.PLAYER_PED_ID().offsetTop - pixels) + 'px'

            }
        }
    },
    MOVE_PLAYER_DOWN(pixels) {
        if ((MAP.GET_MAP().offsetTop - pixels) >= ((MAP.GET_MAP().offsetHeight - window.innerHeight) * -1)) {
            MAP.GET_MAP().style.top = (MAP.GET_MAP().offsetTop - pixels) + 'px'
        }
        else {
            var limite = window.innerHeight - PLAYER.PLAYER_PED_ID().offsetHeight
            if ((PLAYER.PLAYER_PED_ID().offsetTop + pixels) <= limite) {
                PLAYER.PLAYER_PED_ID().style.top = (PLAYER.PLAYER_PED_ID().offsetTop + pixels) + 'px'
            }
        }
    },
    FLIP_PLAYER_WHEN_MOVE() {
        FLIP_PLAYER = true;

    }
}

const GRAPHICS = {
    DRAW_VERT_LINE(x, h, color) {
        var v = document.createElement('div');
        v.style.height = MAP.GET_Y_MAP_SIZE() + 'px';
        v.style.backgroundColor = color;
        v.style.width = h + 'px';
        v.style.margin = '0';
        v.style.padding = '0';
        v.style.position = 'fixed';
        v.style.left = x + 'px';
        v.style.top = '0px';
        document.body.append(v);
        return v;
    }
    ,
    DRAW_HORIZON_LINE(y, tam, color) {
        var h = document.createElement('div');
        h.style.width = MAP.GET_X_MAP_SIZE() + 'px';
        h.style.backgroundColor = color;
        h.style.height = tam + 'px';
        h.style.margin = '0';
        h.style.padding = '0';
        h.style.position = 'fixed';
        h.style.left = '0px';
        h.style.top = y + 'px';
        document.body.append(h);
        return h;
    },
    DRAW_LIGHT(x, y, size = 50, color = 'white') {
        var rect = document.createElement('div');
        rect.style.position = 'absolute';
        rect.style.top = y + 'px';
        rect.style.left = x + 'px';
        rect.style.width = (size * 2) + 'px ';
        rect.style.height = (size * 2) + 'px ';
        rect.style.backgroundColor = color;
        rect.style.borderRadius = '100%';
        rect.style.filter = 'blur(' + Math.floor(size) + 'px)';
        // rect.style.boxShadow = '1px 1px '+(Math.floor(size*2))+'px '+color;

        rect.id = 'light_' + FUNCTIONS.GET_RANDON_INT(0, 5000)
        MAP.GET_MAP().appendChild(rect)
        return rect;
    },
    SET_LIGHT_SIZE(light, size) {
        if (ENTITY.DOES_ENTITY_EXIST(light)) {
            light.style.width = (size * 2) + 'px ';
            light.style.height = (size * 2) + 'px ';
            light.style.filter = 'blur(' + Math.floor(size) + 'px)';
        }
    },
    SET_LIGHT_COLOR(light, color) {
        if (ENTITY.DOES_ENTITY_EXIST(light)) {
            light.style.backgroundColor = color;
        }
    },
    DRAW_TEXT_ON_SCREEN(text, x, y, color = 'black', tamFonte = 25, font = 'monospace') {
        const fundo = document.createElement('font')
        fundo.style.color = color
        fundo.style.position = 'fixed'
        fundo.style.top = y + 'px'
        fundo.style.left = x + 'px'
        fundo.style.fontSize = tamFonte + 'px'
        fundo.style.fontFamily = font
        fundo.innerHTML = text
        fundo.id = 'texto_' + FUNCTIONS.GET_RANDON_INT(0, 5000)
        document.body.appendChild(fundo)
        return fundo
    },
    DRAW_TEXT_ON_MAP(text, x, y, color = 'black', tamFonte = 25, font = 'monospace') {
        const fundo = document.createElement('font')
        fundo.style.color = color
        fundo.style.position = 'relative'
        fundo.style.top = y + 'px'
        fundo.style.left = x + 'px'
        fundo.style.fontSize = tamFonte + 'px'
        fundo.style.fontFamily = font
        fundo.innerHTML = text
        fundo.id = 'texto_' + FUNCTIONS.GET_RANDON_INT(0, 5000)
        MAP.GET_MAP().appendChild(fundo)
        return fundo
    },
    DRAW_SPRITE(src, x, y, w, h) {
        if (ENTITY.DOES_ENTITY_EXIST('fundo')) {
            const img = document.createElement('img')
            img.src = src
            img.style.position = 'absolute'

            MAP.GET_MAP().appendChild(img)
            img.style.width = w + 'px'
            img.style.height = h + 'px'
            img.style.left = (x - (w / 2)) + 'px'
            img.style.top = (y - (h / 2)) + 'px'

            img.id = 'sprite_' + FUNCTIONS.GET_RANDON_INT(0, 5000)

            return img;
        }
    },

    DRAW_RECT_ON_MAP(x, y, w, h, bg = 'black', fontColor = 'white', alpha = '0.9') {
        var rect = document.createElement('div');
        rect.style.position = 'absolute';
        rect.style.top = y + 'px';
        rect.style.left = x + 'px';
        rect.style.width = w + 'px';
        rect.style.height = h + 'px';
        rect.style.padding = '10px';
        rect.style.borderRadius = '10px';
        rect.style.backgroundColor = bg;
        rect.style.color = fontColor;
        rect.style.opacity = alpha;
        rect.id = 'rect_' + FUNCTIONS.GET_RANDON_INT(0, 5000)
        MAP.GET_MAP().appendChild(rect)
        return rect;
    },
    DRAW_RECT_ON_SCREEN(x, y, w, h, bg = 'black', fontColor = 'white', alpha = '0.9') {
        var rect = document.createElement('div');
        rect.style.position = 'fixed';
        rect.style.top = y + 'px';
        rect.style.left = x + 'px';
        rect.style.width = w + 'px';
        rect.style.height = h + 'px';
        rect.style.padding = '10px';
        rect.style.borderRadius = '10px';
        rect.style.backgroundColor = bg;
        rect.style.color = fontColor;
        rect.style.opacity = alpha;
        rect.id = 'rect_' + FUNCTIONS.GET_RANDON_INT(0, 5000)
        document.body.appendChild(rect)
        return rect;
    },
    FLIP_SPRITE_VERTCAL(sprite) {
        if (ENTITY.DOES_ENTITY_EXIST(sprite)) {
            sprite.style.transform = 'scaleY(-1)'
        }
    },
    FLIP_SPRITE_HORIZONTAL(sprite) {
        if (ENTITY.DOES_ENTITY_EXIST(sprite)) {
            sprite.style.transform = 'scaleX(-1)'
        }
    }
}

const DEV = {
    DRAW_FPS_DISPLAY() {
        var lf = performance.now()
        var fc = 0
        var fps = 30//inicial
        cccc()
        function cccc() {
            let n = performance.now()
            let d = n - lf
            fc++
            if (d >= 1000) {
                fps = Math.floor((fc / d) * 1000)
                fc = 0
                lf = n
            }
            requestAnimationFrame(cccc)
        }

        if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
            var marcadorFPS = GRAPHICS.DRAW_RECT_ON_SCREEN(SCREEN.GET_X_SCREEN_SIZE() - 80, 50, 50, 10);
            var textoFPS = GRAPHICS.DRAW_TEXT_ON_SCREEN('hello', 0, 0, 'white', 15);
        }
        else {
            var marcadorFPS = GRAPHICS.DRAW_RECT_ON_SCREEN(SCREEN.GET_X_SCREEN_SIZE() - 80, SCREEN.GET_Y_SCREEN_SIZE() - 40, 50, 10);
            var textoFPS = GRAPHICS.DRAW_TEXT_ON_SCREEN('hello', 0, 0, 'white', 15);
        }

        //CONTROLS.ADD_MOUSE_MOVE_TO_ENTITY(marcadorFPS)
        var loop = setInterval(() => {
            textoFPS.innerHTML = 'FPS: ' + fps
            textoFPS.style.left = (marcadorFPS.offsetLeft + 6) + 'px'
            textoFPS.style.top = (marcadorFPS.offsetTop + 6) + 'px'
        }, 1);
        hooks.push(loop)
    },
    GET_HOOKS_RUNNING() {
        return parseInt(hooks.length)
    },
    DRAW_GRID_LINES(espacamento, color = 'black') {
        espacamento = parseInt(espacamento);
        for (var i = 0; i < 1000; i++) {
            y = parseInt(i * espacamento);
            var f = document.createElement('div');
            f.style.width = '10000px';
            f.style.backgroundColor = color;
            f.style.height = '1px';
            f.style.margin = '0';
            f.style.padding = '0';
            f.style.position = 'fixed';
            f.style.left = '0px';
            f.style.top = y + 'px';
            f.style.opacity = '0.5';
            inserir(f, document.body);

            x = parseInt(i * espacamento);
            var f = document.createElement('div');
            f.style.width = '0.51px';
            f.style.backgroundColor = color;
            f.style.height = '10000px';
            f.style.margin = '0';
            f.style.padding = '0';
            f.style.position = 'fixed';
            f.style.left = x + 'px';
            f.style.top = '0px';
            f.style.opacity = '0.5';
            inserir(f, document.body);
        }
        function inserir(filho, pai) {
            pai.append(filho);
        }
    },
    ADD_ALL_ENTITY_INFO_WHEN_MOUSE_IS_OVER() {
        var loop = setInterval(() => {
            const e = document.querySelectorAll('*')
            e.forEach(b => {
                b.title = `Pos:\nX: ${ENTITY.GET_ENTITY_CENTER_X_COORD(b)}\nY: ${ENTITY.GET_ENTITY_CENTER_Y_COORD(b)}\n\nSize:\nW: ${ENTITY.GET_ENTITY_SIZE(b).x}\nH: ${ENTITY.GET_ENTITY_SIZE(b).y}`
            });
        }, 1000);
        hooks.push(loop)
    },
    DRAW_ENTITY_INFO_PANEL(entity) {

        const r = GRAPHICS.DRAW_RECT_ON_SCREEN(Math.random() * 500, Math.random() * 500, 150, 182, 'black', 'white', '0.8')

        const p = document.createElement('p')
        p.style.fontSize = '20px'
        p.innerHTML = '20px'
        r.appendChild(p)

        const x = document.createElement('input')
        x.type = 'range'
        x.style.width = '100%'
        x.innerHTML = '20px'
        x.value = ENTITY.GET_ENTITY_CENTER_X_COORD(entity)
        x.max = MAP.GET_X_MAP_SIZE()
        r.appendChild(x)

        const y = document.createElement('input')
        y.type = 'range'
        y.style.width = '100%'
        y.innerHTML = '20px'
        y.value = ENTITY.GET_ENTITY_CENTER_Y_COORD(entity)
        y.max = MAP.GET_Y_MAP_SIZE()
        r.appendChild(y)

        const w = document.createElement('input')
        w.type = 'range'
        w.style.width = '100%'
        w.innerHTML = '20px'
        w.value = ENTITY.GET_ENTITY_SIZE(entity).x
        w.max = SCREEN.GET_X_SCREEN_SIZE()
        r.appendChild(w)

        const h = document.createElement('input')
        h.type = 'range'
        h.style.width = '100%'
        h.innerHTML = '20px'
        h.value = ENTITY.GET_ENTITY_SIZE(entity).y
        h.max = SCREEN.GET_Y_SCREEN_SIZE()
        r.appendChild(h)

        p.innerHTML = 'X: ' + ENTITY.GET_ENTITY_CENTER_X_COORD(entity)
        p.innerHTML += '<br>Y: ' + ENTITY.GET_ENTITY_CENTER_Y_COORD(entity)
        p.innerHTML += '<br>W: ' + ENTITY.GET_ENTITY_SIZE(entity).x
        p.innerHTML += '<br>H: ' + ENTITY.GET_ENTITY_SIZE(entity).y


        x.addEventListener('input', (e) => {
            e.stopPropagation()
            entity.style.left = x.value + 'px'
            p.innerHTML = 'X: ' + ENTITY.GET_ENTITY_CENTER_X_COORD(entity)
            p.innerHTML += '<br>Y: ' + ENTITY.GET_ENTITY_CENTER_Y_COORD(entity)
            p.innerHTML += '<br>W: ' + ENTITY.GET_ENTITY_SIZE(entity).x
            p.innerHTML += '<br>H: ' + ENTITY.GET_ENTITY_SIZE(entity).y
        })


        y.addEventListener('input', (e) => {
            e.stopPropagation()
            entity.style.top = y.value + 'px'
            p.innerHTML = 'X: ' + ENTITY.GET_ENTITY_CENTER_X_COORD(entity)
            p.innerHTML += '<br>Y: ' + ENTITY.GET_ENTITY_CENTER_Y_COORD(entity)
            p.innerHTML += '<br>W: ' + ENTITY.GET_ENTITY_SIZE(entity).x
            p.innerHTML += '<br>H: ' + ENTITY.GET_ENTITY_SIZE(entity).y
        })

        w.addEventListener('input', (e) => {
            e.stopPropagation()
            entity.style.width = w.value + 'px'
            p.innerHTML = 'X: ' + ENTITY.GET_ENTITY_CENTER_X_COORD(entity)
            p.innerHTML += '<br>Y: ' + ENTITY.GET_ENTITY_CENTER_Y_COORD(entity)
            p.innerHTML += '<br>W: ' + ENTITY.GET_ENTITY_SIZE(entity).x
            p.innerHTML += '<br>H: ' + ENTITY.GET_ENTITY_SIZE(entity).y
        })

        h.addEventListener('input', (e) => {
            e.stopPropagation()
            entity.style.height = h.value + 'px'
            p.innerHTML = 'X: ' + ENTITY.GET_ENTITY_CENTER_X_COORD(entity)
            p.innerHTML += '<br>Y: ' + ENTITY.GET_ENTITY_CENTER_Y_COORD(entity)
            p.innerHTML += '<br>W: ' + ENTITY.GET_ENTITY_SIZE(entity).x
            p.innerHTML += '<br>H: ' + ENTITY.GET_ENTITY_SIZE(entity).y
        })

        x.addEventListener('click', (e) => {
            e.stopPropagation()
        })
        y.addEventListener('click', (e) => {
            e.stopPropagation()
        })
        w.addEventListener('click', (e) => {
            e.stopPropagation()
        })
        h.addEventListener('click', (e) => {
            e.stopPropagation()
        })

        CONTROLS.ADD_MOUSE_MOVE_TO_ENTITY(r)
        return r;
    },
    CALL_SCENE_CREATOR() {

        const r = GRAPHICS.DRAW_RECT_ON_SCREEN(0, 300, 150, 222, 'black', 'white', '0.8')
        const button = document.createElement('button')
        button.innerHTML = 'Create Enemy'
        button.style.backgroundColor = 'transparent'
        button.style.border = '1px solid white'
        //button.style.borderRadius='4px'
        button.style.color = 'white'
        button.style.width = '100%'
        button.style.marginBottom = '5px'
        button.style.cursor = 'pointer'
        r.appendChild(button)

        const button2 = document.createElement('button')
        button2.innerHTML = 'Create Prop'
        button2.style.backgroundColor = 'transparent'
        button2.style.border = '1px solid white'
        //button2.style.borderRadius='4px'
        button2.style.color = 'white'
        button2.style.width = '100%'
        button2.style.marginBottom = '5px'
        button2.style.cursor = 'pointer'
        r.appendChild(button2)

        const button3 = document.createElement('button')
        button3.innerHTML = 'Create Pickup'
        button3.style.backgroundColor = 'transparent'
        button3.style.border = '1px solid white'
        //butt3n2.style.borderRadius='4px'
        button3.style.color = 'white'
        button3.style.width = '100%'
        button3.style.marginBottom = '5px'
        button3.style.cursor = 'pointer'
        r.appendChild(button3)


        button.addEventListener('click', (e) => {
            e.stopPropagation()
            var aaaa = GRAPHICS.DRAW_SPRITE("inimigo.png", Math.random() * 500, Math.random() * 500, 100, 100)
            CONTROLS.ADD_MOUSE_MOVE_TO_ENTITY(aaaa)
            DEV.DRAW_ENTITY_INFO_PANEL(aaaa)
        })

        button2.addEventListener('click', (e) => {
            e.stopPropagation()
            var aaaa = GRAPHICS.DRAW_SPRITE("montanha.png", Math.random() * 300, Math.random() * 300, 100, 100)
            //ADD_MOUSE_MOVE_TO_ENTITY(aaaa)
            DEV.DRAW_ENTITY_INFO_PANEL(aaaa)
        })
        button3.addEventListener('click', (e) => {
            e.stopPropagation()
            var aaaa2 = PICKUP.CREATE_PICKUP_ITEM("vida.png", Math.random() * 300, Math.random() * 300, 100, 100)
            //ADD_MOUSE_MOVE_TO_ENTITY(aaaa)
            //REMOVE_WHITE_BACKGROUND(aaaa2)
            DEV.DRAW_ENTITY_INFO_PANEL(aaaa2)
        })


        CONTROLS.ADD_MOUSE_MOVE_TO_ENTITY(r)
        return r;
    }
    ,

}

const ALERT = {
    ADD_FOOT_INFO(texto = '<marquee>BresoDEV</marquee>') {
        var footer = document.createElement('div');
        footer.style.width = '100%';
        footer.style.backgroundColor = 'black';
        footer.style.position = 'fixed';
        footer.style.bottom = '0';
        footer.style.padding = '5px';
        footer.style.opacity = '0.9';
        document.body.style.padding = '0';
        document.body.style.margin = '0';
        var footerText = document.createElement('spam');
        footer.append(footerText);
        footerText.innerHTML = texto;
        footerText.style.color = 'aliceblue';
        footerText.id = 'footer';
        document.body.append(footer);
        return footer;
    },
    SHOW_MESSAGE(msg, time = 3000) {
        const fundo = document.createElement('div')
        fundo.style.position = 'fixed'
        fundo.style.width = '91%'
        fundo.style.minHeight = '100px'
        fundo.style.bottom = '1%'
        fundo.style.left = '1%'
        fundo.style.backgroundColor = 'black'
        fundo.style.color = 'white'
        fundo.style.padding = '3%'
        fundo.style.borderRadius = '10px'
        fundo.style.fontSize = '20px'
        fundo.style.opacity = '0.8'
        fundo.style.fontFamily = 'monospace'
        fundo.style.border = '5px solid white'
        fundo.innerHTML = msg

        document.body.appendChild(fundo)
        setTimeout(() => {
            fundo.remove()
        }, time);
    },
    SHOW_MESSAGE_WITH_IMG(image, msg, time = 3000) {
        const fundo = document.createElement('div')
        fundo.style.position = 'fixed'
        fundo.style.width = '91%'
        fundo.style.minHeight = '100px'
        fundo.style.bottom = '1%'
        fundo.style.left = '1%'
        fundo.style.backgroundColor = 'black'
        fundo.style.color = 'white'
        fundo.style.padding = '3%'
        fundo.style.borderRadius = '10px'
        fundo.style.fontSize = '20px'
        fundo.style.opacity = '0.8'
        fundo.style.fontFamily = 'monospace'
        fundo.style.border = '5px solid white'
        fundo.style.display = 'flex'
        fundo.innerHTML = '<img src="' + image + '" style="width: 8%;height:8%; margin-right:1%">' + msg

        document.body.appendChild(fundo)
        setTimeout(() => {
            fundo.remove()
        }, time);
    },
    SHOW_INFO(titulo, texto, corFundo = 'black', corFonte = 'white', tempo = 4000) {
        var fundo = document.createElement('div');
        fundo.style.position = 'fixed';
        fundo.style.bottom = '10px';
        fundo.style.left = '10px';
        fundo.style.width = '200px';
        fundo.style.padding = '10px';
        fundo.style.borderRadius = '10px';
        fundo.style.backgroundColor = corFundo;
        fundo.style.color = 'white';
        fundo.style.opacity = '0.0';

        var texto1 = document.createElement('span');
        texto1.style.width = '100%';
        texto1.style.color = corFonte;
        texto1.innerHTML = titulo + '<br>';


        var texto2 = document.createElement('span');
        texto2.style.width = '100%';
        texto2.style.color = corFonte;
        texto2.innerHTML = texto;



        document.body.append(fundo);

        fundo.append(texto1);

        fundo.append(texto2);

        var opac = 0;

        //exibir
        var l1 = setInterval(() => {
            if (opac !== 100) {
                fundo.style.opacity = opac * 0.01;
                opac++;
            }
            else
                clearInterval(l1);

        }, 10);
        hooks.push(l1)
        //remover
        setTimeout(() => {
            l1 = setInterval(() => {
                if (opac !== 0) {
                    fundo.style.opacity = opac * 0.01;
                    opac--;
                }
                else {
                    fundo.remove();
                    clearInterval(l1);
                }

            }, 10);
            hooks.push(l1)
        }, tempo);
    }

}

const SCREEN = {
    GET_X_SCREEN_SIZE() {
        return window.innerWidth
    }
    ,
    GET_Y_SCREEN_SIZE() {
        return window.innerHeight
    }
    ,
    GET_CENTER_X_SCREEN() {
        return window.innerWidth / 2
    }
    ,
    GET_CENTER_Y_SCREEN() {
        return window.innerHeight / 2
    }
}

const CONTROLS = {
    ADD_VOID_CLICK_TO_ENTITY(entity, voids) {
        if (ENTITY.DOES_ENTITY_EXIST(entity)) {
            entity.addEventListener('click', (e) => {
                voids()
            })
        }
    },
    ADD_KEYBOARD_EVENT(tecla, voids) {
        document.body.addEventListener('keydown', (e) => {
            if (e.key == tecla.toLowerCase()) {
                voids()
            }
            if (e.key == tecla.toUpperCase()) {
                voids()
            }
        });
    },
    SHOW_MOUSE() {
        document.body.style.cursor = 'pointer'
    },
    HIDE_MOUSE() {
        document.body.style.cursor = 'none'
    },
    ADD_PLAYER_AWSD_MOVIMENT(speed) {
        document.body.addEventListener('keydown', (e) => {
            if (e.key == 'd' || e.key == 'D') {

                ENTITY.SAVE_ENTITY_COORDS(PLAYER.PLAYER_PED_ID())
                ENTITY.SAVE_ENTITY_COORDS(MAP.GET_MAP())

                PLAYER.MOVE_PLAYER_RIGHT(speed)

                if (ENTITY.IS_ENTITY_COLLIDED_TO_ANY_COLLISION_BLOCK(PLAYER.PLAYER_PED_ID())) {
                    ENTITY.RESTORE_ENTITY_COORDS(PLAYER.PLAYER_PED_ID())
                    ENTITY.RESTORE_ENTITY_COORDS(MAP.GET_MAP())
                }
                if (FLIP_PLAYER) {
                    PLAYER.PLAYER_PED_ID().style.transform = 'scaleX(1)'
                }
            }
            if (e.key == 'a' || e.key == 'A') {

                ENTITY.SAVE_ENTITY_COORDS(PLAYER.PLAYER_PED_ID())
                ENTITY.SAVE_ENTITY_COORDS(MAP.GET_MAP())

                PLAYER.MOVE_PLAYER_LEFT(speed)

                if (ENTITY.IS_ENTITY_COLLIDED_TO_ANY_COLLISION_BLOCK(PLAYER.PLAYER_PED_ID())) {
                    ENTITY.RESTORE_ENTITY_COORDS(PLAYER.PLAYER_PED_ID())
                    ENTITY.RESTORE_ENTITY_COORDS(MAP.GET_MAP())
                }
                if (FLIP_PLAYER) {
                    PLAYER.PLAYER_PED_ID().style.transform = 'scaleX(-1)'
                }
            }
            if (e.key == 'w' || e.key == 'W') {

                ENTITY.SAVE_ENTITY_COORDS(PLAYER.PLAYER_PED_ID())
                ENTITY.SAVE_ENTITY_COORDS(MAP.GET_MAP())

                PLAYER.MOVE_PLAYER_UP(speed)


                if (ENTITY.IS_ENTITY_COLLIDED_TO_ANY_COLLISION_BLOCK(PLAYER.PLAYER_PED_ID())) {
                    ENTITY.RESTORE_ENTITY_COORDS(PLAYER.PLAYER_PED_ID())
                    ENTITY.RESTORE_ENTITY_COORDS(MAP.GET_MAP())
                }
            }
            if (e.key == 's' || e.key == 'S') {

                ENTITY.SAVE_ENTITY_COORDS(PLAYER.PLAYER_PED_ID())
                ENTITY.SAVE_ENTITY_COORDS(MAP.GET_MAP())

                PLAYER.MOVE_PLAYER_DOWN(speed)

                if (ENTITY.IS_ENTITY_COLLIDED_TO_ANY_COLLISION_BLOCK(PLAYER.PLAYER_PED_ID())) {
                    ENTITY.RESTORE_ENTITY_COORDS(PLAYER.PLAYER_PED_ID())
                    ENTITY.RESTORE_ENTITY_COORDS(MAP.GET_MAP())
                }
            }

        })
    },

    ADD_MOUSE_MOVE_TO_ENTITY(element) {
        const position = element.style.position
        let x, y
        var move = false
        element.addEventListener('click', (e) => {
            move = !move
            if (move === false) {
                element.style.position = position
            }
        })
        document.addEventListener('mousemove', (e) => {
            if (move) {
                x = e.clientX - ((element.offsetWidth / 2) - 5)
                y = e.clientY - ((element.offsetHeight / 2) - 5)
            }

        })
        var loop = setInterval(() => {
            if (move && element) {
                element.style.position = 'fixed'
                element.style.left = x + 'px'
                element.style.top = y + 'px'
                element.style.cursor = 'pointer'
            }
        }, 1);
        hooks.push(loop)
    }






}

const COMPONENT = {
    SET_PROGRESS_BAR_MIN_VALUE(pb, value) {
        if (ENTITY.DOES_ENTITY_EXIST(pb)) {
            if (value <= 100 && value >= 0) {
                pb.style.minWidth = value + '%'
            } else {
                pb.style.minWidth = '0%'
            }
        }
    },
    SET_PROGRESS_BAR_MAX_VALUE(pb, value) {
        if (ENTITY.DOES_ENTITY_EXIST(pb)) {
            if (value <= 100) {
                pb.style.maxWidth = value + '%'
            } else {
                pb.style.maxWidth = '100%'
            }
        }
    },
    SET_PROGRESS_BAR_COLOR(bar, color) {
        if (ENTITY.DOES_ENTITY_EXIST(bar)) {
            bar.style.backgroundColor = color
        }
    },
    GET_PROGRESS_BAR_VALUE(bar) {
        if (ENTITY.DOES_ENTITY_EXIST(bar)) {
            return Math.floor(bar.clientWidth)
        }
    },
    CREATE_PROGRESS_BAR(x, y, w, h, color, attach = '') {
        const fundo = document.createElement('div')
        fundo.style.width = w + 'px'
        fundo.style.height = h + 'px'
        fundo.style.border = '1px solid white'
        fundo.style.color = 'white'
        fundo.style.borderRadius = '3px'
        fundo.style.margin = '3px'
        fundo.style.position = 'relative'
        fundo.style.top = y + 'px'
        fundo.style.left = x + 'px'
        fundo.style.zIndex = '100'
        //fundo.id='STATUS_BAR'
        const fundo2 = document.createElement('div')
        fundo2.style.width = '100%'
        fundo2.style.height = '100%'
        fundo2.style.backgroundColor = color
        fundo2.style.color = 'white'
        fundo2.style.borderRadius = '3px'
        fundo2.id = 'progressbar_' + FUNCTIONS.GET_RANDON_INT(0, 5000)

        fundo.appendChild(fundo2)

        if (attach === '') {
            MAP.GET_MAP().appendChild(fundo)
        }
        else {
            fundo.style.position = 'fixed'
            document.body.appendChild(fundo)
        }

        return fundo2
    },
    SET_PROGRESS_BAR_VALUE(pb, value) {
        if (ENTITY.DOES_ENTITY_EXIST(pb)) {
            if (value <= 100) {
                pb.style.width = value + '%'
            }
        }
    },
    SET_PROGRESS_BAR_VALUE_WITH_COLOR(pb, value) {
        if (value <= 100) {
            pb.style.width = value + '%'
        }
        if (value >= 70 && value <= 100) {
            pb.style.backgroundColor = 'green'
        }
        if (value >= 30 && value <= 69) {
            pb.style.backgroundColor = 'yellow'
        }
        if (value >= 10 && value <= 29) {
            pb.style.backgroundColor = 'orange'
        }
        if (value <= 10) {
            pb.style.backgroundColor = 'red'
        }
    }
}

const PICKUP = {
    CREATE_PICKUP_ITEM(sprite, x, y, w, h) {
        var aaaa = GRAPHICS.DRAW_SPRITE(sprite, x, y, w, h)

        aaaa.style.animation = 'ping 1s infinite'
        aaaa.id = 'pickup_' + FUNCTIONS.GET_RANDON_INT(0, 5000)
        var style = document.createElement('style')
        style.innerHTML = `
        @keyframes ping{
            0%{
                scale:1.0;
            }
            50%{
                scale:1.1;
            }
            100%{
                scale:1.0;
            }
        }`
        document.head.appendChild(style)
        return aaaa
    },
    IS_PICKUP_COLLECTED(pickup) {
        if (ENTITY.DOES_ENTITY_EXIST(pickup)) {
            if (ENTITY.IS_ENTITY_COLLIDED_TO_ENTITY(PLAYER.PLAYER_PED_ID(), pickup)) {
                return true
            }
        }
        return false
    }
}

const FUNCTIONS = {
    GET_RANDON_INT(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min
    },
    GET_RANDON_FLOAT(min, max) {
        return Math.random() * (max - min) + min
    },
    RELOAD_GAME() {
        window.location.reload()
    },
    CREATE_SHOOT_TO_COORD(textura, w, h, destinationX, destinationY, velocidade, destroyEntityCollided = true) {
        /*
        var x = ENTITY.GET_ENTITY_CENTER_X_COORD(inimigo)
         var y = ENTITY.GET_ENTITY_CENTER_Y_COORD(inimigo)
         CREATE_SHOOT_TO_COORD('vida.png', x, y, 3, true)
         */
        function stopped(entity) {
            var x = ENTITY.GET_ENTITY_CENTER_X_COORD(entity)
            var y = ENTITY.GET_ENTITY_CENTER_Y_COORD(entity)

            return new Promise((resolve) => {
                setTimeout(() => {
                    if (ENTITY.GET_ENTITY_CENTER_X_COORD(entity) == x) {
                        if (ENTITY.GET_ENTITY_CENTER_Y_COORD(entity) == y) {
                            resolve(true)
                        }
                        resolve(false)
                    }
                    resolve(false)

                }, 8000);
            })


        }

        var x = ENTITY.GET_ENTITY_CENTER_X_COORD(PLAYER.PLAYER_PED_ID())
        var y = ENTITY.GET_ENTITY_CENTER_Y_COORD(PLAYER.PLAYER_PED_ID())
        const bala = GRAPHICS.DRAW_SPRITE(textura, x, y, w, h)
        const rotacao = ENTITY.GET_ENTITY_ROTATION(PLAYER.PLAYER_PED_ID())
        ENTITY.SET_ENTITY_ROTATION(bala, rotacao)

        ENTITY.MOVE_ENTITY_TO_COORDS_WITH_DELAY(bala, destinationX, destinationY, velocidade)

        var contador = 0

        var loop = setInterval(() => {

            if (ENTITY.IS_VISIBLE(bala)) {
                if (ENTITY.IS_ENTITY_COLLIDED_TO_ANY_COLLISION_BLOCK(bala)) {

                    if (destroyEntityCollided) {
                        const ini = GET_ENTITY_COLLIDED(bala)
                        ENTITY.DELETE_ENTITY(ini)
                    }

                    ENTITY.DELETE_ENTITY(bala)
                    clearInterval(loop)
                }
                else if (ENTITY.IS_ENTITY_AT_COORD(bala, destinationX, destinationY, 5)) {
                    ENTITY.DELETE_ENTITY(bala)
                    clearInterval(loop)
                }

                stopped(bala).then(m => {//bala parou e nao atingiu ninguem
                    if (m == false) {
                        ENTITY.DELETE_ENTITY(bala)
                        clearInterval(loop)
                    }
                })



                contador++
            }
            else {
                ENTITY.DELETE_ENTITY(bala)
                clearInterval(loop)
            }
        }, 1);
        hooks.push(loop)
    }
}

const STYLE = {
    SET_BORDER_RADIUS(entity, value) {
        entity.style.borderRadius = value + 'px'
    },

}

const EFFECTS = {
    REMOVE_ALL(sprite) {
        sprite.style.mixBlendMode = 'normal';
        sprite.style.filter = 'none';
    },

    BLUR_ITEM(sprite) {
        sprite.style.filter = 'blur(5px)';
    },
    BLACK_AND_WHITE(sprite) {
        sprite.style.filter = 'grayscale(1)';
    },
    SEPIA(sprite) {
        sprite.style.filter = 'sepia(1)';
    }
}

const AUDIO = {
    CREATE_AUDIO(src) {
        const audio = document.createElement('audio')
        const source = document.createElement('source')
        source.src = src
        source.type = 'audio/mpeg'
        audio.appendChild(source)
        audio.style.position = 'fixed'
        audio.style.left = '-2000px'
        audio.style.top = '-2000px'
        audio.id = 'audio_' + FUNCTIONS.GET_RANDON_INT(0, 5000)
        document.body.appendChild(audio)
        return audio
    },
    PLAY_AUDIO(audio) {
        var loop = setInterval(() => {
            if (teveInteracao) {
                audio.play()
                clearInterval(loop)
            }
        }, 1);
        hooks.push(loop)
    },
    PLAY_AUDIO_IN_LOOP(audio) {
        var loop = setInterval(() => {
            if (teveInteracao) {
                audio.loop = true
                audio.play()
                clearInterval(loop)
            }
        }, 1);
        hooks.push(loop)

    },
    STOP_AUDIO(audio) {
        audio.stop()
    },
    DELETE_AUDIO(audio) {
        AUDIO.STOP_AUDIO(audio)
        audio.remove()
    },
    SET_AUDIO_VOLUME(audio, volume) {
        audio.volume = volume / 100
    },
    ATTACH_AUDIO_TO_ENTITY(src, entity) {
        setTimeout(() => {
            var musica = AUDIO.CREATE_AUDIO(src);
            AUDIO.PLAY_AUDIO_IN_LOOP(musica);
            AUDIO.SET_AUDIO_VOLUME(musica, 0);

            var d1 = raioStartPlay
            var d2 = Math.floor(raioStartPlay / 2)
            var d3 = Math.floor(d2 / 2)
            var d4 = Math.floor(d3 / 2)
            var d5 = Math.floor(d4 / 2)
            var d6 = Math.floor(d5 / 2)



            var loop = setInterval(() => {

                var vl = 0;
                if (ENTITY.IS_ENTITY_NEAR_ENTITY(PLAYER.PLAYER_PED_ID(), entity, d1)) {
                    vl = 30
                }
                if (ENTITY.IS_ENTITY_NEAR_ENTITY(PLAYER.PLAYER_PED_ID(), entity, d2)) {
                    vl = 40
                }
                if (ENTITY.IS_ENTITY_NEAR_ENTITY(PLAYER.PLAYER_PED_ID(), entity, d3)) {
                    vl = 50
                }
                if (ENTITY.IS_ENTITY_NEAR_ENTITY(PLAYER.PLAYER_PED_ID(), entity, d4)) {
                    vl = 60
                }
                if (ENTITY.IS_ENTITY_NEAR_ENTITY(PLAYER.PLAYER_PED_ID(), entity, d5)) {
                    vl = 85
                }
                if (ENTITY.IS_ENTITY_NEAR_ENTITY(PLAYER.PLAYER_PED_ID(), entity, d6)) {
                    vl = 100
                }
                AUDIO.SET_AUDIO_VOLUME(musica, vl);




            }, 1000);
            hooks.push(loop)
        }, 3000);
    }
    ,
}

const STATUS_BAR = {
    CREATE_STATUS_BAR() {
        const fundo = document.createElement('div')
        fundo.style.position = 'fixed'
        fundo.style.display = 'flex'
        fundo.style.width = '100%'
        fundo.style.top = '0'
        fundo.style.left = '0'
        fundo.style.backgroundColor = 'black'
        fundo.style.color = 'white'
        fundo.style.padding = '1%'
        fundo.style.paddingLeft = '3%'
        fundo.style.paddingRight = '3%'
        //fundo.style.borderRadius = '10px'
        fundo.id = 'STATUS_BAR'

        document.body.appendChild(fundo)
        return fundo
    },
    ADD_STATUS_BAR_ITEM(value, color) {
        const fundo = document.createElement('div')

        fundo.style.width = '20%'
        fundo.style.height = '20px'
        fundo.style.border = '1px solid white'
        fundo.style.color = 'white'
        fundo.style.borderRadius = '3px'
        fundo.style.margin = '3px'


        document.getElementById('STATUS_BAR').appendChild(fundo)

        const fundo2 = document.createElement('div')

        fundo2.style.width = value + '%'
        fundo2.style.height = '20px'
        fundo2.style.backgroundColor = color
        fundo2.style.color = 'white'
        fundo2.style.borderRadius = '3px'

        fundo2.id = 'statusbarItem_' + FUNCTIONS.GET_RANDON_INT(0, 5000)

        fundo.appendChild(fundo2)

        return fundo2
    }

}

const MOBILE = {

    ADD_MOBILE_BUTTON(txt, voids) {
        contador_de_botoes_celular += 50

        const bt = document.createElement('button')
        bt.style.position = 'fixed'
        bt.style.right = '10px'
        bt.style.bottom = contador_de_botoes_celular + 'px'
        bt.style.padding = '10px'
        bt.style.fontSize = '20px'
        bt.style.borderRadius = '4px'
        bt.innerHTML = txt

        bt.id = 'btmobile_' + FUNCTIONS.GET_RANDON_INT(0, 5000)

        document.body.appendChild(bt)



        bt.addEventListener('touchstart', () => {
            voids()
        })
        return bt

    },
    DELETE_ALL_MOBILE_BUTTONS() {
        var blocos = document.body.querySelectorAll('*')
        blocos.forEach(e => {
            if (e.id.includes('btmobile_')) {
                ENTITY.DELETE_ENTITY(e)
            }
        });
    },
    SET_MOBILE_BUTTON_TEXT(bt, txt) {
        if (ENTITY.DOES_ENTITY_EXIST(bt)) {
            bt.innerHTML = txt
        }
    },
    SET_MOBILE_BUTTON_FONT_COLOR(bt, color) {
        if (ENTITY.DOES_ENTITY_EXIST(bt)) {
            bt.style.color = color
        }
    },
    SET_MOBILE_BUTTON_BG_COLOR(bt, color) {
        if (ENTITY.DOES_ENTITY_EXIST(bt)) {
            bt.style.backgroundColor = color
        }
    },
    SHOW_MOBILE_CONTROLS(speed) {
        if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
            const btEsq = document.createElement('button')
            btEsq.style.position = 'fixed'
            btEsq.style.left = '10px'
            btEsq.style.bottom = '10px'
            btEsq.style.padding = '10px'
            btEsq.style.fontSize = '20px'
            btEsq.style.borderRadius = '4px'
            btEsq.innerHTML = 'A'
            document.body.appendChild(btEsq)

            const btBaixo = document.createElement('button')
            btBaixo.style.position = 'fixed'
            btBaixo.style.left = '60px'
            btBaixo.style.bottom = '10px'
            btBaixo.style.padding = '10px'
            btBaixo.style.fontSize = '20px'
            btBaixo.style.borderRadius = '4px'
            btBaixo.innerHTML = 'S'
            document.body.appendChild(btBaixo)

            const btDir = document.createElement('button')
            btDir.style.position = 'fixed'
            btDir.style.left = '110px'
            btDir.style.bottom = '10px'
            btDir.style.padding = '10px'
            btDir.style.fontSize = '20px'
            btDir.style.borderRadius = '4px'
            btDir.innerHTML = 'D'
            document.body.appendChild(btDir)

            const btCima = document.createElement('button')
            btCima.style.position = 'fixed'
            btCima.style.left = '60px'
            btCima.style.bottom = '70px'
            btCima.style.padding = '10px'
            btCima.style.fontSize = '20px'
            btCima.style.borderRadius = '4px'
            btCima.innerHTML = 'W'
            document.body.appendChild(btCima)

            const showMapa = document.createElement('button')
            showMapa.style.position = 'fixed'
            showMapa.style.right = '10px'
            showMapa.style.bottom = '10px'
            showMapa.style.padding = '10px'
            showMapa.style.fontSize = '20px'
            showMapa.style.borderRadius = '4px'
            showMapa.innerHTML = 'Mapa'
            document.body.appendChild(showMapa)

            btCima.style.minWidth = '40px'
            btBaixo.style.minWidth = '40px'
            btDir.style.minWidth = '40px'
            btEsq.style.minWidth = '40px'



            btCima.style.maxWidth = '40px'
            btBaixo.style.maxWidth = '40px'
            btDir.style.maxWidth = '40px'
            btEsq.style.maxWidth = '40px'

            //btCima.style.   opacity = '0.8'
            //btBaixo.style.  opacity = '0.8'
            //btDir.style.    opacity = '0.8'
            //btEsq.style.    opacity = '0.8'

            btCima.style.boxShadow = '10px 10px 30px black'
            btBaixo.style.boxShadow = '10px 10px 30px black'
            btDir.style.boxShadow = '10px 10px 30px black'
            btEsq.style.boxShadow = '10px 10px 30px black'
            showMapa.style.boxShadow = '10px 10px 30px black'

            //---------------------------
            var direcao = 0

            //---------------------------

            var loop = setInterval(() => {
                if (direcao === 1 && estaComODedoNaTela)//direita
                {
                    ENTITY.SAVE_ENTITY_COORDS(PLAYER.PLAYER_PED_ID())
                    ENTITY.SAVE_ENTITY_COORDS(MAP.GET_MAP())

                    PLAYER.MOVE_PLAYER_RIGHT(speed)

                    if (ENTITY.IS_ENTITY_COLLIDED_TO_ANY_COLLISION_BLOCK(PLAYER.PLAYER_PED_ID())) {
                        ENTITY.RESTORE_ENTITY_COORDS(PLAYER.PLAYER_PED_ID())
                        ENTITY.RESTORE_ENTITY_COORDS(MAP.GET_MAP())
                    }
                    if (FLIP_PLAYER) {
                        PLAYER.PLAYER_PED_ID().style.transform = 'scaleX(1)'
                    }
                }
                if (direcao === 2 && estaComODedoNaTela)//baixo
                {
                    ENTITY.SAVE_ENTITY_COORDS(PLAYER.PLAYER_PED_ID())
                    ENTITY.SAVE_ENTITY_COORDS(MAP.GET_MAP())

                    PLAYER.MOVE_PLAYER_DOWN(speed)

                    if (ENTITY.IS_ENTITY_COLLIDED_TO_ANY_COLLISION_BLOCK(PLAYER.PLAYER_PED_ID())) {
                        ENTITY.RESTORE_ENTITY_COORDS(PLAYER.PLAYER_PED_ID())
                        ENTITY.RESTORE_ENTITY_COORDS(MAP.GET_MAP())
                    }
                }
                if (direcao === 3 && estaComODedoNaTela)//esquerda
                {
                    ENTITY.SAVE_ENTITY_COORDS(PLAYER.PLAYER_PED_ID())
                    ENTITY.SAVE_ENTITY_COORDS(MAP.GET_MAP())

                    PLAYER.MOVE_PLAYER_LEFT(speed)

                    if (ENTITY.IS_ENTITY_COLLIDED_TO_ANY_COLLISION_BLOCK(PLAYER.PLAYER_PED_ID())) {
                        ENTITY.RESTORE_ENTITY_COORDS(PLAYER.PLAYER_PED_ID())
                        ENTITY.RESTORE_ENTITY_COORDS(MAP.GET_MAP())
                    }
                    if (FLIP_PLAYER) {
                        PLAYER.PLAYER_PED_ID().style.transform = 'scaleX(-1)'
                    }
                }
                if (direcao === 4 && estaComODedoNaTela)//cima
                {
                    ENTITY.SAVE_ENTITY_COORDS(PLAYER.PLAYER_PED_ID())
                    ENTITY.SAVE_ENTITY_COORDS(MAP.GET_MAP())

                    PLAYER.MOVE_PLAYER_UP(speed)


                    if (ENTITY.IS_ENTITY_COLLIDED_TO_ANY_COLLISION_BLOCK(PLAYER.PLAYER_PED_ID())) {
                        ENTITY.RESTORE_ENTITY_COORDS(PLAYER.PLAYER_PED_ID())
                        ENTITY.RESTORE_ENTITY_COORDS(MAP.GET_MAP())
                    }
                }
            }, 100);
            hooks.push(loop)

            btCima.addEventListener('touchstart', () => {
                direcao = 4

            })
            btBaixo.addEventListener('touchstart', () => {
                direcao = 2
            })
            btDir.addEventListener('touchstart', () => {

                direcao = 1

            })
            btEsq.addEventListener('touchstart', () => {
                direcao = 3
            })


            showMapa.addEventListener('touchstart', (e) => {
                e.stopPropagation()
                if (!ENTITY.DOES_ENTITY_EXIST('mapview')) {
                    const mapview = document.createElement('img')
                    mapview.src = MAP.GET_MAP_IMG()
                    mapview.style.position = 'absolute'
                    mapview.style.width = '80%'
                    mapview.style.height = '60%'
                    mapview.style.left = '10%'
                    mapview.style.top = '20%'
                    mapview.style.borderRadius = '3%'
                    mapview.style.border = '5px solid black'
                    mapview.id = 'mapview'
                    document.body.appendChild(mapview)
                }
                else {
                    ENTITY.DELETE_ENTITY(ENTITY.GET_ENTITY('mapview'))
                }
            })

        }
    },
    GET_TOUCH_X_COORD() {
        document.body.addEventListener('touchstart', (e) => {
            var l = e.target.getBoundingClientRect().left
            touchstartX = parseInt(e.touches[0].clientX - l)
        })
    },
    GET_TOUCH_Y_COORD() {
        document.body.addEventListener('touchstart', (e) => {
            var t = e.target.getBoundingClientRect().top
            touchstartY = parseInt(e.touches[0].clientY - t)
        })
    },
    ADD_VOID_TOUCHED_AT_AREA(x, y, radius, voids) {
        MOBILE.GET_TOUCH_X_COORD()
        MOBILE.GET_TOUCH_Y_COORD()
        document.body.addEventListener('touchstart', (e) => {

            var xRadiusD = parseInt(x + radius)
            var xRadiusE = parseInt(x - radius)
            var yRadiusC = parseInt(y - radius)
            var yRadiusB = parseInt(y + radius)

            if (touchstartX >= xRadiusE && touchstartX <= xRadiusD) {
                if (touchstartY >= yRadiusC && touchstartY <= yRadiusB) {
                    voids()
                }
            }
        })
    },
    ADD_VOID_TOUCHED_TO_ENTITY(entity, voids) {
        if (ENTITY.DOES_ENTITY_EXIST(entity)) {
            entity.addEventListener('touchstart', (e) => {
                voids()
            })
        }
    },

}

const POOLS = {

    GET_ALL_ENEMYS() {
        var blocos = MAP.GET_MAP().querySelectorAll('*')
        var bb = []
        var colidiu = false
        blocos.forEach(e => {
            if (e.id.includes('inimigo_')) {
                bb.push(e)
            }
        });
        return bb
    },
    GET_ALL_FRIENDS() {
        var blocos = MAP.GET_MAP().querySelectorAll('*')
        var bb = []
        var colidiu = false
        blocos.forEach(e => {
            if (e.id.includes('amigo_')) {
                bb.push(e)
            }
        });
        return bb
    },
    GET_ALL_ENTITYS_WITH_COLLISION() {
        var blocos = MAP.GET_MAP().querySelectorAll('*')
        var bb = []
        var colidiu = false
        blocos.forEach(e => {
            if (e.id.includes('bloco_')) {
                bb.push(e)
            }
        });
        return bb
    },
    GET_ALL_MOBILE_BUTTONS() {
        var blocos = MAP.GET_MAP().querySelectorAll('*')
        var bb = []
        var colidiu = false
        blocos.forEach(e => {
            if (e.id.includes('btmobile_')) {
                bb.push(e)
            }
        });
        return bb
    },
    GET_ALL_STATUSBARS() {
        var blocos = MAP.GET_MAP().querySelectorAll('*')
        var bb = []
        var colidiu = false
        blocos.forEach(e => {
            if (e.id.includes('statusbarItem_')) {
                bb.push(e)
            }
        });
        return bb
    },
    GET_ALL_AUDIOS() {
        var blocos = MAP.GET_MAP().querySelectorAll('*')
        var bb = []
        var colidiu = false
        blocos.forEach(e => {
            if (e.id.includes('audio_')) {
                bb.push(e)
            }
        });
        return bb
    },
    GET_ALL_PICKUPS() {
        var blocos = MAP.GET_MAP().querySelectorAll('*')
        var bb = []
        var colidiu = false
        blocos.forEach(e => {
            if (e.id.includes('pickup_')) {
                bb.push(e)
            }
        });
        return bb
    },
    GET_ALL_PROGRESSBARS() {
        var blocos = MAP.GET_MAP().querySelectorAll('*')
        var bb = []
        var colidiu = false
        blocos.forEach(e => {
            if (e.id.includes('progressbar_')) {
                bb.push(e)
            }
        });
        return bb
    },
    GET_ALL_LIGHTS() {
        var blocos = MAP.GET_MAP().querySelectorAll('*')
        var bb = []
        var colidiu = false
        blocos.forEach(e => {
            if (e.id.includes('light_')) {
                bb.push(e)
            }
        });
        return bb
    },
    GET_ALL_TEXTS() {
        var blocos = MAP.GET_MAP().querySelectorAll('*')
        var bb = []
        var colidiu = false
        blocos.forEach(e => {
            if (e.id.includes('texto_')) {
                bb.push(e)
            }
        });
        return bb
    },
    GET_ALL_SPRITES() {
        var blocos = MAP.GET_MAP().querySelectorAll('*')
        var bb = []
        var colidiu = false
        blocos.forEach(e => {
            if (e.id.includes('sprite_')) {
                bb.push(e)
            }
        });
        return bb
    },
    GET_ALL_RECTS() {
        var blocos = MAP.GET_MAP().querySelectorAll('*')
        var bb = []
        var colidiu = false
        blocos.forEach(e => {
            if (e.id.includes('rect_')) {
                bb.push(e)
            }
        });
        return bb
    },
    GET_ALL_ENTITYS() {
        var inimigos = POOLS.GET_ALL_ENEMYS()
        var amigos = POOLS.GET_ALL_FRIENDS()
        var blocos = POOLS.GET_ALL_ENTITYS_WITH_COLLISION()
        var bt = POOLS.GET_ALL_MOBILE_BUTTONS()
        var sb = POOLS.GET_ALL_STATUSBARS()
        var au = POOLS.GET_ALL_AUDIOS()
        var pi = POOLS.GET_ALL_PICKUPS()
        var pbb = POOLS.GET_ALL_PROGRESSBARS()
        var l = POOLS.GET_ALL_LIGHTS()
        var li = POOLS.GET_ALL_TEXTS()
        var sp = POOLS.GET_ALL_SPRITES()
        var ret = POOLS.GET_ALL_RECTS()

        var todos = inimigos.concat(
            amigos,
            blocos,
            bt,
            sb,
            au,
            pi,
            pbb,
            l,
            li,
            sp,
            ret,

        )
        todos.forEach(element => {
            ENTITY.DELETE_ENTITY(element)
        });

    },
    DELETE_ALL_ENTITYS() {
        var inimigos = POOLS.GET_ALL_ENEMYS()
        var amigos = POOLS.GET_ALL_FRIENDS()
        var blocos = POOLS.GET_ALL_ENTITYS_WITH_COLLISION()
        var bt = POOLS.GET_ALL_MOBILE_BUTTONS()
        var sb = POOLS.GET_ALL_STATUSBARS()
        var au = POOLS.GET_ALL_AUDIOS()
        var pi = POOLS.GET_ALL_PICKUPS()
        var pbb = POOLS.GET_ALL_PROGRESSBARS()
        var l = POOLS.GET_ALL_LIGHTS()
        var li = POOLS.GET_ALL_TEXTS()
        var sp = POOLS.GET_ALL_SPRITES()
        var ret = POOLS.GET_ALL_RECTS()

        var todos = inimigos.concat(
            amigos,
            blocos,
            bt,
            sb,
            au,
            pi,
            pbb,
            l,
            li,
            sp,
            ret,

        )
        todos.forEach(element => {
            ENTITY.DELETE_ENTITY(element)
        });

    },
    GET_CLOSEST_FRIEND() {
        var amigos = POOLS.GET_ALL_FRIENDS()
        var elemento;
        var min = 1000;
        amigos.forEach(e => {
            var d = ENTITY.GET_DISTANCE_BETWEEN_ENTITYS(PLAYER.PLAYER_PED_ID(), e)
            if (d < min) {
                min = d
                elemento = e
            }

        });
        return elemento
    },
    GET_CLOSEST_ENEMY() {
        var amigos = POOLS.GET_ALL_ENEMYS()
        var elemento;
        var min = 1000;
        amigos.forEach(e => {
            var d = ENTITY.GET_DISTANCE_BETWEEN_ENTITYS(PLAYER.PLAYER_PED_ID(), e)
            if (d < min) {
                min = d
                elemento = e
            }

        });
        return elemento
    }



}

const INVENTORY = {
    SAVE_INVENTORY_ITEM_QUANT(itemName, quant) {
        localStorage.setItem(MAP.GET_GAME_NAME() + '_' + itemName + '_quant', quant)
    },
    ADD_INVENTORY_ITEM_QUANT(itemName, quant) {
        var estoque = INVENTORY.GET_INVENTORY_ITEM_QUANT(itemName)
        estoque += quant
        INVENTORY.SAVE_INVENTORY_ITEM_QUANT(itemName, estoque)
    },
    REMOVE_INVENTORY_ITEM_QUANT(itemName, quant) {
        if (INVENTORY.PLAYER_HAVE_ITEM(itemName, quant)) {
            var estoque = INVENTORY.GET_INVENTORY_ITEM_QUANT(itemName)
            estoque -= quant
            INVENTORY.SAVE_INVENTORY_ITEM_QUANT(itemName, estoque)
        }
    },
    PLAYER_HAVE_ITEM(itemName, quant) {
        var estoque = INVENTORY.GET_INVENTORY_ITEM_QUANT(itemName)
        if (estoque >= quant) {
            return true
        }
        return false
    },
    GET_INVENTORY_ITEM_QUANT(itemName) {
        return parseInt(localStorage.getItem(MAP.GET_GAME_NAME() + '_' + itemName + '_quant'))
    },
    SAVE_INVENTORY_ITEM_IMG(itemName, img) {
        localStorage.setItem(MAP.GET_GAME_NAME() + '_' + itemName + '_img', img)
    },
    GET_INVENTORY_ITEM_IMG(itemName) {
        return parseInt(localStorage.getItem(MAP.GET_GAME_NAME() + '_' + itemName + '_img'))
    },
    CLEAR_ALL_INVENTORY() {
        for (let i = 0; i < localStorage.length; i++) {
            let k = localStorage.key(i)
            if (k.includes('_quant')) {
                localStorage.setItem(k, 0)
            }
        }
    },

}

const GAME = {
    SET_GAME_NAME(name) {
        localStorage.setItem('game_name', name)
    },
    GET_GAME_NAME() {
        return localStorage.getItem('game_name')
    },
    DOES_GAME_NAME_AS_DEFINED() {
        return localStorage.getItem('game_name') !== null
    }
}

const CAM = {
    SET_CAMERA_FOCUS_ON_COORD(x, y) {

        ENTITY.SAVE_ENTITY_COORDS(MAP.GET_MAP())

        var novoX = x
        var novoY = y
        if (novoX <= Math.floor(window.innerWidth / 2)) {
            novoX = 0
        }
        if (novoY <= Math.floor(window.innerHeight / 2)) {
            novoY = 0
        }
        if (novoX >= (MAP.GET_X_MAP_SIZE() - Math.floor(window.innerWidth / 2))) {
            novoX = (MAP.GET_X_MAP_SIZE() - Math.floor(window.innerWidth))

        }
        if (novoY >= (MAP.GET_Y_MAP_SIZE() - Math.floor(window.innerHeight / 2))) {
            novoY = (MAP.GET_Y_MAP_SIZE() - Math.floor(window.innerHeight))
        }
        ENTITY.SET_ENTITY_VISIBLE(PLAYER.PLAYER_PED_ID(), false)
        MAP.GET_MAP().style.left = (novoX * -1) + 'px'
        MAP.GET_MAP().style.top = (novoY * -1) + 'px'

    },
    RESTORE_CAMERA_FOCUS_ON_PLAYER() {
        ENTITY.RESTORE_ENTITY_COORDS(MAP.GET_MAP())
        ENTITY.SET_ENTITY_VISIBLE(PLAYER.PLAYER_PED_ID(), true)
    }
}

