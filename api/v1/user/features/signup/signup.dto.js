const z = require('zod');

const normalizeInput = (value) => {
    if (typeof value !== 'string') return value;
    return value.normalize("NFKC");
};

const normalizedString = (schema) =>
    z.preprocess(normalizeInput, schema);

const validIranMobilePrefixes = [
    // MCI (Hamrah Aval)
    "0910", "0911", "0912", "0913", "0914", "0915", "0916",
    "0917", "0918", "0919",

    // Irancell
    "0901", "0902", "0903", "0905",
    "0930", "0933", "0935", "0936", "0937", "0938", "0939",

    // Rightel
    "0920", "0921", "0922"
];

const sanitizeSignupDTO = z.object({
    name: normalizedString(
        z.string()
            .min(3)
            .max(30)
            .regex(/^[A-Za-z]+$/)
            .trim()
    ),
    family: normalizedString(
        z.string()
            .min(3)
            .max(30)
            .regex(/^[A-Za-z]+$/)
            .trim()
    ).optional(),
    phone: normalizedString(
        z.string()
            .regex(/^09\d{9}$/)
            .trim()
            .refine((value) => {
                const prefix = value.slice(0, 4);
                return validIranMobilePrefixes.includes(prefix);
            }, {
                message: "Invalid Iranian mobile prefix"
            })
    ),
    email: normalizedString(
        z.string()
            .min(10)
            .max(100)
            .regex(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z]{2,}$/)
            .trim()
    ).optional(),
    birthDay: normalizedString(
        z.string()
            .min(10)
            .max(10)
            .regex(/^(13\d{2}|14\d{2})\/(0[1-9]|1[0-2])\/(0[1-9]|[12]\d|3[01])$/)
            .trim()
    ),
    nationalCode: normalizedString(
        z.string()
            .min(10)
            .max(10)
            .regex(/^[0-9]+$/)
            .trim()
    ).optional()
}).strict();

module.exports = {
    sanitizeSignupDTO
}