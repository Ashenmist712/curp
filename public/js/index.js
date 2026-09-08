
//mandamos a traer nuestra lista de ciudades con su clave-valor
const ciudades = obtenerCiudades();
//guardamos las expresiones que usaremos para validar los datos
const expresiones = {
    //validamos que el nombre tenga letras, espacios o guiones
    nombre: /^[A-ZÁÉÍÓÚÜÑ' -]+$/i,
    //validamos que la fecha tenga el formato de año, mes y dia
    fecha: /^\d{4}-\d{2}-\d{2}$/,
    //validamos que el sexo sea H de hombre o M de mujer
    sexo: /^[HM]$/,
    //validamos que la curp tenga la estructura esperada
    curp: /^[A-Z]{4}\d{6}[HM][A-Z]{5}[A-Z0-9]\d$/
};

//creamos nuestro arreglo de las palabras antisonantes.
const palabrasAntisonantes = /^(BACA|BAKA|BUEI|BUEY|CACA|CACO|CAGA|CAGO|CAKA|COGE|COJA|COJE|COJI|COJO|CULO|FALO|FETO|GUEI|GUEY|JOTO|KACA|KACO|KAGA|KAGO|KAKA|KAKO|KOGE|KOJA|KOJE|KOJI|KOJO|KULO|MAME|MAMO|MEAR|MEAS|MEON|MION|MOCO|NACA|NACO|PEDA|PEDO|PENE|PIPI|PITO|POPO|PUTA|PUTO|QULO|RATA|RUIN)$/;

//aqui normalizamos todos los datos
const normalizar = (texto) => texto
    //separamos las letras con acentos de sus marcas
    .normalize('NFD')
    //quitamos las marcas de los acentos
    .replace(/[\u0300-\u036f]/g, '')
    //quitamos espacios al inicio y al final
    .trim()
    //convertimos todo el texto a mayusculas
    .toUpperCase();

//comprobamos que el nombre cumpla con la expresion correspondiente
const validarNombre = (nombre) => {
    //guardamos si el nombre cumple la expresion
    let nombreValido = expresiones.nombre.test(nombre);
    //devolvemos el resultado de la validacion
    return nombreValido;
};
//comprobamos que la fecha tenga formato y que exista en el calendario
const validarFecha = (fecha) => {
    //si la fecha no tiene el formato esperado la rechazamos
    if (!expresiones.fecha.test(fecha)) {
        //indicamos que la fecha no es valida
        return false;
    }
    //separamos el año, mes y dia y convertimos cada parte a numero
    const partesFecha = fecha.split('-').map(Number);
    //guardamos el año
    const anio = partesFecha[0];
    //guardamos el mes
    const mes = partesFecha[1];
    //guardamos el dia
    const dia = partesFecha[2];
    //creamos una fecha con los valores recibidos
    const fechaReal = new Date(anio, mes - 1, dia);
    //obtenemos la fecha actual para evitar fechas futuras
    const hoy = new Date();
    //comparamos que la fecha creada coincida con la fecha recibida
    //comparamos el año de la fecha creada con el año recibido
    return fechaReal.getFullYear() === anio &&
        //comparamos el mes de la fecha creada con el mes recibido
        fechaReal.getMonth() === mes - 1 &&
        //comparamos el dia de la fecha creada con el dia recibido
        fechaReal.getDate() === dia &&
        //comprobamos que la fecha no sea posterior al dia de hoy
        fechaReal <= hoy;
};
//comprobamos que el sexo sea uno de los valores permitidos
const validarSexo = (sexo) => {
    //guardamos si el sexo cumple la expresion
    let sexoValido = expresiones.sexo.test(sexo);
    //devolvemos el resultado de la validacion
    return sexoValido;
};

//buscamos la ciudad cuyo nombre coincida con el recibido
const buscarCiudad = (nombre) => {
    //recorremos la lista de ciudades una por una
    for (let indice = 0; indice < ciudades.length; indice++) {
        //obtenemos la ciudad actual
        let ciudad = ciudades[indice];
        //normalizamos ambos nombres antes de compararlos
        let nombreCiudad = normalizar(ciudad.nombre);
        let nombreBuscado = normalizar(nombre);
        //si los nombres coinciden devolvemos la ciudad
        if (nombreCiudad === nombreBuscado) {
            return ciudad;
        }
    }
    //si no encontramos la ciudad devolvemos null
    return null;
};

//comprobamos si la ciudad existe
const validarCiudad = (nombre) => {
    //buscamos la ciudad recibida
    let ciudad = buscarCiudad(nombre);
    //si existe devolvemos verdadero, si no devolvemos falso
    if (ciudad !== null) {
        return true;
    }
    return false;
};
//obtenemos la primera vocal del apellido despues de su primera letra
const obtenerVocal = (apellido) => {
    //separamos el apellido desde la segunda letra
    let resto = apellido.slice(1);
    //buscamos una vocal dentro del resto del apellido
    let vocal = resto.match(/[AEIOU]/);
    //si encontramos una vocal la devolvemos
    if (vocal) {
        return vocal[0];
    }
    //si no encontramos una vocal devolvemos X
    return 'X';
};
//obtenemos la primera consonante del texto despues de su primera letra
const obtenerConsonante = (texto) => {
    //separamos el texto desde la segunda letra
    let resto = texto.slice(1);
    //buscamos una consonante dentro del resto del texto
    let consonante = resto.match(/[BCDFGHJKLMNPQRSTVWXYZÑ]/);
    //si encontramos una consonante la devolvemos
    if (consonante) {
        return consonante[0];
    }
    //si no encontramos una consonante devolvemos X
    return 'X';
};

//obtenemos el primer nombre que se usara para generar la curp
const obtenerPrimerNombre = (nombre) => {
    //separamos todos los nombres recibidos
    const nombres = nombre.split(/\s+/);
    //guardamos el primer nombre
    const primero = nombres[0];
    //guardamos el segundo nombre
    const segundo = nombres[1];
    //guardamos los nombres comunes que pueden omitirse en la curp
    const nombresComunes = /^(MARIA|MA|JOSE|J)$/;
    //si el primer nombre es comun usamos el segundo cuando exista
    if (nombresComunes.test(primero) && segundo) {
        return segundo;
    }
    //si no es comun o no hay segundo nombre usamos el primero
    return primero;
};

//corregimos las palabras consideradas antisonantes en la curp
const corregirPalabraAntisonante = (base) => {
    //tomamos las primeras cuatro letras de la curp base
    const primerasLetras = base.substring(0, 4);
    //reemplazamos la segunda letra si se forma una palabra prohibida
    const baseCorregida = palabrasAntisonantes.test(primerasLetras)
        ? base.slice(0, 1) + 'X' + base.slice(2)
        : base;
    //devolvemos la base corregida o la base original
    return baseCorregida;
};

//generamos la homoclave usando los caracteres de la curp base
const generarHomoclave = (base) => {
    //iniciamos en cero el acumulado de los caracteres
    let total = 0;
    //convertimos la base en un arreglo de caracteres y la recorremos
    base.split('').forEach((caracter, indice) => {
        //sumamos el codigo del caracter multiplicado por su posicion
        total += caracter.charCodeAt(0) * (indice + 1);
    });
    //formamos la homoclave con una letra y un numero
    return `${String.fromCharCode(65 + (total % 26))}${total % 10}`;
};

//generamos la curp completa a partir de los datos validados
const generarCurp = (datos) => {
    //obtenemos cada dato del objeto recibido
    const nombre = datos.nombre;
    const apellidoPaterno = datos.apellidoPaterno;
    const apellidoMaterno = datos.apellidoMaterno;
    const fecha = datos.fecha;
    const sexo = datos.sexo;
    const ciudad = datos.ciudad;
    //separamos el año, mes y dia de la fecha de nacimiento
    const partesFecha = fecha.split('-');
    //guardamos el año
    const anio = partesFecha[0];
    //guardamos el mes
    const mes = partesFecha[1];
    //guardamos el dia
    const dia = partesFecha[2];
    //obtenemos el nombre que se tomara para la curp
    const primerNombre = obtenerPrimerNombre(nombre);
    //comenzamos la base con la primera letra del apellido paterno
    let base = apellidoPaterno[0];
    //agregamos la primera vocal interna del apellido paterno
    base = base + obtenerVocal(apellidoPaterno);
    //agregamos la primera letra del apellido materno o X si no existe
    if (apellidoMaterno[0]) {
        base = base + apellidoMaterno[0];
    } else {
        base = base + 'X';
    }
    //agregamos la primera letra del primer nombre
    base = base + primerNombre[0];
    //agregamos los dos ultimos digitos del año
    base = base + anio.slice(2);
    //agregamos el mes y el dia
    base = base + mes + dia;
    //agregamos la letra correspondiente al sexo
    base = base + sexo;
    //agregamos la clave de la ciudad de nacimiento
    base = base + ciudad.clave;
    //agregamos la primera consonante interna del apellido paterno
    base = base + obtenerConsonante(apellidoPaterno);
    //agregamos la primera consonante interna del apellido materno
    base = base + obtenerConsonante(apellidoMaterno);
    //agregamos la primera consonante interna del primer nombre
    base = base + obtenerConsonante(primerNombre);
    //corregimos la curp base si contiene una palabra antisonante
    const baseCorregida = corregirPalabraAntisonante(base);
    //unimos la base corregida con la homoclave
    return baseCorregida + generarHomoclave(baseCorregida);
};

//mostramos la curp generada dentro del formulario
const mostrarResultado = (curp, formulario) => {
    //buscamos si ya existe un elemento para mostrar el resultado
    let resultado = document.querySelector('#resultado-curp');
    //si no existe creamos el elemento de salida
    if (!resultado) {
        //creamos un elemento output para mostrar la curp
        resultado = document.createElement('output');
        //asignamos un identificador al resultado
        resultado.id = 'resultado-curp';
        //agregamos las clases visuales del mensaje
        resultado.className = 'd-block mt-3 alert alert-success';
        //insertamos el resultado al final del formulario
        formulario.append(resultado);
    }
    //escribimos la curp generada en pantalla
    resultado.textContent = 'CURP generada: ' + curp;
    //guardamos en un atributo si la curp cumple la expresion
    resultado.dataset.valida = String(expresiones.curp.test(curp));
};

//buscamos el formulario principal de la pagina
const formulario = document.querySelector('#formulario');
//continuamos solo si el formulario existe en el documento
if (formulario) {
    //obtenemos todos los campos que se usaran del formulario
    const campos = {
        //obtenemos el campo del nombre
        nombre: document.querySelector('#nombre'),
        //obtenemos el campo del apellido paterno
        apellidoPaterno: document.querySelector('#apellidoPaterno'),
        //obtenemos el campo del apellido materno
        apellidoMaterno: document.querySelector('#apellidoMaterno'),
        //obtenemos el campo de la fecha de nacimiento
        fechaNacimiento: document.querySelector('#fechaNacimiento'),
        //obtenemos el campo del sexo
        sexo: document.querySelector('#sexo'),
        //obtenemos el campo de la ciudad de nacimiento
        ciudadNacimiento: document.querySelector('#ciudadNacimiento')
    };

    //recorremos todas las ciudades disponibles
    ciudades.forEach((ciudad) => {
        //creamos una opcion para el selector de ciudades
        const opcion = document.createElement('option');
        //usamos el nombre de la ciudad como valor de la opcion
        opcion.value = ciudad.nombre;
        //mostramos el nombre y la clave de la ciudad
        opcion.textContent = ciudad.nombre + ' (' + ciudad.clave + ')';
        //agregamos la opcion al selector del formulario
        campos.ciudadNacimiento.append(opcion);
    });

    //escuchamos el envio del formulario
    formulario.addEventListener('submit', (evento) => {
        //evitamos que la pagina se recargue al enviar el formulario
        evento.preventDefault();
        //creamos un objeto con todos los datos normalizados del formulario
        const datos = {
            //normalizamos el nombre escrito por la persona
            nombre: normalizar(campos.nombre.value),
            //normalizamos el apellido paterno
            apellidoPaterno: normalizar(campos.apellidoPaterno.value),
            //normalizamos el apellido materno
            apellidoMaterno: normalizar(campos.apellidoMaterno.value),
            //guardamos la fecha seleccionada
            fecha: campos.fechaNacimiento.value,
            //guardamos el sexo seleccionado
            sexo: campos.sexo.value,
            //buscamos y guardamos el objeto de la ciudad seleccionada
            ciudad: buscarCiudad(campos.ciudadNacimiento.value)
        };
        //validamos que los tres nombres o apellidos tengan un formato correcto
        let nombresValidos = true;
        //validamos el nombre
        if (!validarNombre(datos.nombre)) {
            nombresValidos = false;
        }
        //validamos el apellido paterno
        if (!validarNombre(datos.apellidoPaterno)) {
            nombresValidos = false;
        }
        //validamos el apellido materno
        if (!validarNombre(datos.apellidoMaterno)) {
            nombresValidos = false;
        }
        //validamos todos los datos necesarios para generar la curp
        let datosValidos = nombresValidos;
        //comprobamos que la fecha sea valida
        if (!validarFecha(datos.fecha)) {
            datosValidos = false;
        }
        //comprobamos que el sexo sea valido
        if (!validarSexo(datos.sexo)) {
            datosValidos = false;
        }
        //comprobamos que la ciudad sea valida
        if (!validarCiudad(campos.ciudadNacimiento.value)) {
            datosValidos = false;
        }

        //si algun dato es incorrecto mostramos el estado de validacion
        if (!datosValidos) {
            //marcamos el formulario como revisado por bootstrap
            formulario.classList.add('was-validated');
            //avisamos que se deben corregir los datos
            alert('Revisa nombres, fecha, sexo y entidad de nacimiento.');
            //detenemos el proceso para no generar una curp invalida
            return;
        }

        //generamos y mostramos la curp cuando todos los datos son validos
        mostrarResultado(generarCurp(datos), formulario);
    });
}