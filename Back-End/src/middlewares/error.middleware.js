import ApiError from '../exceptions/api.error.js';
import { ZodError } from 'zod';
import { Prisma } from '@prisma/client';

export const errorHandler = (err, req, res, next) => {
    let statusCode = 500;
    let message = 'Evento inesperado en el núcleo del servidor';
    let errors = [];

    // Body JSON inválido (express.json / body-parser)
    if (
        err instanceof SyntaxError &&
        (err.status === 400 || err.statusCode === 400 || 'body' in err)
    ) {
        statusCode = 400;
        message = 'JSON malformado en el cuerpo de la solicitud';
        errors = [message];
    } else if (err instanceof ZodError) {
        statusCode = 400;
        message = 'Inconsistencia en datos ingresados';
        errors = err.issues.map(issue => `${issue.path.join('.')} ${issue.message}`);
    } else if (err instanceof ApiError) {
        statusCode = err.statusCode;
        message = err.message;
        errors = [err.message];
    } else if (err instanceof Prisma.PrismaClientInitializationError || (err instanceof Prisma.PrismaClientKnownRequestError && err.code.startsWith('P10'))) {
        console.error('🔴 FALLA PRISMA:', { codigo: err.code, msg: err.message });
        statusCode = 503;
        message = 'La base de datos no responde o está fuera de línea';
        errors = [message, `Código Prisma: ${err.code || 'N/A'}`, `Detalle: ${err.message}`];
    } else {
        console.error(err);
        errors = [message];
    }

    res.status(statusCode).json({
        status: 'error',
        statusCode,
        message,
        errors,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
};

export default errorHandler;
