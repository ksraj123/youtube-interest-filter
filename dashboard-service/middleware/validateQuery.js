import { StatusCodes } from 'http-status-codes';

export const validQueryParams = (paramsModel) => {
    return (req, res, next) => {
        const params = {};
        Object.keys(req.query)
            .filter(param => Object.keys(paramsModel).includes(param))
            .forEach(param => params[param] = req.query[param]);
        try {
            Object.keys(params).forEach(param => {
                if (Array.isArray(paramsModel[param]) && !paramsModel[param].includes(params[param]))
                    throw `Invalid value '${params[param]}' for query param '${param}'`
            })
        } catch (err) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                Error: err
            })
        }
        req.query = params;
        next();
    }
}
