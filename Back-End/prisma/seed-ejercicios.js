import prisma from '../src/config/prisma.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const desafios = [
  {
    categoria: "Geometría",
    niveles: [
      {
        grado: 1,
        nombre: "Reconocimiento y Ángulos",
        descripcion: "El mundo que ves: identificar formas en objetos cotidianos y entender que los ángulos son solo \"aperturas\".",
        ejercicios: [
          { pregunta: "Mirá la pantalla de tu celular. ¿Qué figura geométrica predomina?", opciones: ["Círculo", "Triángulo", "Pentágono", "Rectángulo"], correcta: 3 },
          { pregunta: "Si abrís una puerta a la mitad, ¿qué tipo de ángulo se forma entre la puerta y el marco en la base?", opciones: ["Ángulo recto", "Ángulo agudo", "Ángulo obtuso", "Ángulo llano"], correcta: 0 },
          { pregunta: "Identificá cuál de estos objetos representa mejor una circunferencia:", opciones: ["Una regla", "Una moneda", "Un billete", "Un lápiz"], correcta: 1 },
          { pregunta: "¿Cuál de estas figuras tiene sus cuatro lados exactamente iguales?", opciones: ["Cuadrado", "Rectángulo", "Óvalo", "Trapecio"], correcta: 0 },
          { pregunta: "En una colmena de abejas, ¿qué figura geométrica se repite para formar los panales?", opciones: ["Cuadrado", "Círculo", "Hexágono", "Octógono"], correcta: 2 },
        ]
      },
      {
        grado: 2,
        nombre: "Perímetro",
        descripcion: "El contorno o \"el borde\": el perímetro es la suma de todos los lados. Útil para cercos, marcos o costura.",
        ejercicios: [
          { pregunta: "Querés ponerle un marco de madera a una foto cuadrada de 20 cm de lado. ¿Cuántos cm de madera necesitas comprar?", opciones: ["40 cm", "20 cm", "80 cm", "400 cm"], correcta: 2 },
          { pregunta: "Tu patio rectangular mide 10 m de largo y 5 m de ancho. ¿Cuántos metros de alambre necesitas para rodearlo con una vuelta?", opciones: ["30 m", "15 m", "50 m", "60 m"], correcta: 0 },
          { pregunta: "Una mesa de luz tiene forma de triángulo con tres lados iguales de 80 cm cada uno. ¿Cuál es su perímetro?", opciones: ["320 cm", "80 cm", "160 cm", "240 cm"], correcta: 3 },
          { pregunta: "Si un camino tiene forma de \"L\", con un tramo de 4 m y otro de 3 m, ¿cuántos metros recorriste en total?", opciones: ["7 m", "1 m", "12 m", "5 m"], correcta: 0 },
          { pregunta: "¿Cuál es el perímetro de una ventana que tiene 1,5 m de alto por 1 m de ancho?", opciones: ["1,5 m", "2,5 m", "5 m", "3 m"], correcta: 2 },
        ]
      },
      {
        grado: 3,
        nombre: "Área",
        descripcion: "La superficie o \"lo de adentro\": el área mide cuánto espacio ocupa una figura. Crucial para pintura, pisos o telas.",
        ejercicios: [
          { pregunta: "Tenés que pintar una pared de 4 m de largo por 3 m de alto. ¿Cuántos m² de pintura necesitas cubrir?", opciones: ["7 m²", "12 m²", "14 m²", "24 m²"], correcta: 1 },
          { pregunta: "Un mantel cuadrado mide 2 m de cada lado. ¿Cuál es su superficie total?", opciones: ["4 m²", "8 m²", "2 m²", "16 m²"], correcta: 0 },
          { pregunta: "La pantalla de una tablet mide 20 cm de ancho por 15 cm de alto. ¿Cuál es su área en cm²?", opciones: ["150 cm²", "70 cm²", "35 cm²", "300 cm²"], correcta: 3 },
          { pregunta: "¿Cuál es el área de un terreno rectangular que tiene 10 m de frente por 30 m de fondo?", opciones: ["80 m²", "300 m²", "40 m²", "600 m²"], correcta: 1 },
          { pregunta: "Si un cerámico para el piso mide 0,5 m por 0,5 m, ¿qué superficie cubre cada pieza?", opciones: ["0,5 m²", "1 m²", "2 m²", "0,25 m²"], correcta: 3 },
        ]
      },
      {
        grado: 4,
        nombre: "Triángulos y Figuras Compuestas",
        descripcion: "El área del triángulo (base por altura dividido 2) y cómo dividir figuras raras en pedazos fáciles.",
        ejercicios: [
          { pregunta: "Un estante triangular tiene una base de 60 cm y una altura de 40 cm. ¿Cuál es su área?", opciones: ["1.200 cm²", "2.400 cm²", "100 cm²", "200 cm²"], correcta: 0 },
          { pregunta: "Calculá el área de un banderín cuya base mide 20 cm y su altura es de 30 cm.", opciones: ["600 cm²", "300 cm²", "50 cm²", "100 cm²"], correcta: 1 },
          { pregunta: "Tenés una habitación en forma de \"L\" formada por un sector de 3 x 4 m y otro sector de 2 x 2 m. ¿Cuál es el área total?", opciones: ["16 m²", "14 m²", "24 m²", "20 m²"], correcta: 0 },
          { pregunta: "El frente de una casa se compone de un cuadrado de 5 x 5 m y un techo triangular arriba de 2 m de altura. ¿Cuál es el área total del frente?", opciones: ["30 m²", "35 m²", "25 m²", "50 m²"], correcta: 0 },
          { pregunta: "¿Por qué dividimos por 2 en la fórmula para calcular el área de un triángulo?", opciones: ["Porque solo se calcula la mitad de la base.", "Porque tiene 3 lados.", "Porque así lo requiere el sistema métrico.", "Porque un triángulo es siempre la mitad de un rectángulo con su misma base y altura."], correcta: 3 },
        ]
      },
      {
        grado: 5,
        nombre: "Desafíos Reales (Pitágoras y Volúmenes)",
        descripcion: "Calcular diagonales (escaleras) y capacidad (baldes/tanques).",
        ejercicios: [
          { pregunta: "Apoyás una escalera a 3 m de la pared (base) y esta llega a una altura de 4 m en el muro. Según Pitágoras, ¿cuánto mide la escalera?", opciones: ["7 m", "5 m", "12 m", "25 m"], correcta: 1 },
          { pregunta: "Un tanque de agua tiene forma de cubo y mide 1 m de cada lado (ancho, largo y alto). ¿Cuántos litros de agua le entran?", opciones: ["1.000 litros", "1 litro", "100 litros", "10.000 litros"], correcta: 0 },
          { pregunta: "Para hacer una falda circular, la cintura mide 62,8 cm. ¿Cuál es el radio para trazar el círculo?", opciones: ["6,28 cm", "20 cm", "31,4 cm", "10 cm"], correcta: 3 },
          { pregunta: "¿Cuántos cm mide la diagonal de una televisión de 50 pulgadas? (1 pulgada = 2,54 cm)", opciones: ["100 cm", "50 cm", "127 cm", "150 cm"], correcta: 2 },
          { pregunta: "Un balde cilíndrico tiene un área de base de 0,05 m² y una altura de 0,4 m. ¿Cuál es su capacidad en metros cúbicos (volumen)?", opciones: ["0,02 m³", "0,2 m³", "0,002 m³", "0,09 m³"], correcta: 0 },
        ]
      },
    ]
  },
  {
    categoria: "Porcentajes",
    niveles: [
      {
        grado: 1,
        nombre: "Descuentos en compras",
        descripcion: "Cálculo directo de descuentos en compras cotidianas.",
        ejercicios: [
          { pregunta: "Un abrigo cuesta $100.000 y tiene 20% de descuento. ¿Cuánto pagas?", opciones: ["$80.000", "$20.000", "$98.000", "$82.000"], correcta: 0 },
          { pregunta: "Queres comprarte unos zapatos y encontrar dos ofertas ¿Cuál es más barato: Zapatos $80.000 con 25% desc. o Zapatos $90.000 con 30% desc.?", opciones: ["Ambas cuestan igual", "Zapatos $80.000 con 25% desc.", "Zapatos $90.000 con 30% desc.", "No se puede saber"], correcta: 1 },
          { pregunta: "Un electrodoméstico de $100.000 con 20% de descuento y luego 10% adicional. ¿Precio final?", opciones: ["$70.000", "$72.000", "$75.000", "$80.000"], correcta: 1 },
        ]
      },
      {
        grado: 2,
        nombre: "IVA y aumentos de precios",
        descripcion: "Cálculo de IVA (21%) y aumentos porcentuales sobre precios.",
        ejercicios: [
          { pregunta: "Un vino cuesta $5.000 sin IVA (21%). ¿Precio final?", opciones: ["$6.050", "$5.105", "$6.100", "$1.050"], correcta: 0 },
          { pregunta: "Pagaste $80.000 por un pantalón (incluye 21% IVA). ¿Cuál era el precio sin IVA?", opciones: ["$96.800", "$13.884,30", "$66.115,70", "$75.000"], correcta: 2 },
          { pregunta: "El costo del alquiler de $450.000 aumentó un 12%. ¿Nuevo costo?", opciones: ["$54.000", "$504.000", "$405.000", "$45.000"], correcta: 1 },
        ]
      },
      {
        grado: 3,
        nombre: "Propinas y gastos compartidos",
        descripcion: "Cálculo de propinas y división de gastos entre varias personas.",
        ejercicios: [
          { pregunta: "Estas cenando con amigos, el total del ticket es de $180.000. Querés dar 10% de propina. ¿Total a pagar?", opciones: ["$198.000", "$18.000", "$181.000", "$190.000"], correcta: 0 },
          { pregunta: "Estas cenando con 3 amigos, cena de $200.000 + 10% propina. ¿Cuánto paga cada uno?", opciones: ["$220.000", "$50.000", "$52.500", "$55.000"], correcta: 3 },
        ]
      },
      {
        grado: 4,
        nombre: "Presupuesto y ahorro",
        descripcion: "Cálculo de porcentajes sobre el salario para ahorro y gastos.",
        ejercicios: [
          { pregunta: "Si tu salario es de $500.000. ¿Cuánto es el 20% para ahorro?", opciones: ["$400.000", "$50.000", "$200.000", "$100.000"], correcta: 3 },
          { pregunta: "Si gastas $75.000 en transporte sobre salario de $500.000. ¿Qué porcentaje es?", opciones: ["10%", "15%", "20%", "7.5%"], correcta: 1 },
        ]
      },
      {
        grado: 5,
        nombre: "Variación porcentual",
        descripcion: "Calcular el porcentaje de aumento o disminución entre dos valores.",
        ejercicios: [
          { pregunta: "Un kilo de asado pasó de $8.000 a $9.600. ¿Aumento %?", opciones: ["20%", "16%", "10%", "25%"], correcta: 0 },
          { pregunta: "El seguro del auto bajó de $120.000 a $100.000. ¿Baja %?", opciones: ["15%", "20%", "16,67%", "10%"], correcta: 2 },
        ]
      },
      {
        grado: 6,
        nombre: "Intereses e inversiones",
        descripcion: "Cálculo de interés simple sobre una inversión.",
        ejercicios: [
          { pregunta: "Si Invertís $100.000 al 5% anual simple. ¿Cuánto vas a tener al finalizar el año?", opciones: ["$105.000", "$5.000", "$150.000", "$100.500"], correcta: 0 },
        ]
      },
    ]
  }
];

async function main() {
  console.log('🚀 Iniciando seed de ejercicios...');
  
  for (const desafio of desafios) {
    for (const nivel of desafio.niveles) {
      const nombreSeccion = `${desafio.categoria} - ${nivel.nombre}`;
      
      // 🔍 Buscar si la sección ya existe por nombre
      let seccion = await prisma.seccion.findFirst({
        where: { nombre: nombreSeccion }
      });

      if (seccion) {
        // 📝 Actualizar sección existente
        seccion = await prisma.seccion.update({
          where: { id: seccion.id },
          data: {
            descripcion: nivel.descripcion,
            grado: nivel.grado,
            puntosRequeridos: 0,
            puntosRecompensa: 50,
            umbralAprobacion: 0.66,
          }
        });
        console.log(`🔄 Sección actualizada: ${seccion.nombre} (id ${seccion.id})`);
      } else {
        // ✨ Crear nueva sección
        seccion = await prisma.seccion.create({
          data: {
            nombre: nombreSeccion,
            descripcion: nivel.descripcion,
            grado: nivel.grado,
            puntosRequeridos: 0,
            puntosRecompensa: 50,
            umbralAprobacion: 0.66,
          }
        });
        console.log(`✅ Sección creada: ${seccion.nombre} (id ${seccion.id})`);
      }

      // 🔄 Procesar ejercicios
      for (const ej of nivel.ejercicios) {
        const tituloEscenario = ej.pregunta.slice(0, 60);
        
        // Buscar si el escenario ya existe en esta sección
        let escenario = await prisma.escenario.findFirst({
          where: {
            titulo: tituloEscenario,
            seccionId: seccion.id
          }
        });

        if (escenario) {
          // Actualizar escenario existente
          escenario = await prisma.escenario.update({
            where: { id: escenario.id },
            data: {
              descripcion: ej.pregunta,
              pregunta: ej.pregunta,
              categoria: desafio.categoria,
            }
          });
          
          // Eliminar opciones viejas
          await prisma.opcion.deleteMany({
            where: { escenarioId: escenario.id }
          });
          console.log(`   ↻ Escenario actualizado: ${tituloEscenario.substring(0, 30)}...`);
        } else {
          // Crear nuevo escenario
          escenario = await prisma.escenario.create({
            data: {
              titulo: tituloEscenario,
              descripcion: ej.pregunta,
              pregunta: ej.pregunta,
              categoria: desafio.categoria,
              tipo: 'opcion_multiple',
              seccionId: seccion.id,
            }
          });
          console.log(`   ✨ Escenario creado: ${tituloEscenario.substring(0, 30)}...`);
        }

        // Crear nuevas opciones
        for (let i = 0; i < ej.opciones.length; i++) {
          await prisma.opcion.create({
            data: {
              texto: ej.opciones[i],
              puntos: i === ej.correcta ? 10 : 0,
              esCorrecta: i === ej.correcta,
              escenarioId: escenario.id,
            }
          });
        }
      }
      console.log(`   → ${nivel.ejercicios.length} ejercicios procesados`);
    }
  }
  console.log('🎉 Seed de ejercicios completado.');
}

main()
  .catch((e) => {
    console.error('❌ Error en el seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });