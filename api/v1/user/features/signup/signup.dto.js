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
            .trim()
            .min(3)
            .max(30)
            .regex(/^[A-Za-z]+$/)
    ),
    family: normalizedString(
        z.string()
            .trim()
            .min(3)
            .max(30)
            .regex(/^[A-Za-z]+$/)
    ).optional(),
    phone: normalizedString(
        z.string()
            .trim()
            .regex(/^09\d{9}$/)
            .refine((value) => {
                const prefix = value.slice(0, 4);
                return validIranMobilePrefixes.includes(prefix);
            }, {
                message: "Invalid Iranian mobile prefix"
            })
    ),
    email: normalizedString(
        z.string()
            .trim()
            .min(10)
            .max(100)
            .regex(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z]{2,}$/)
    ).optional(),
    birthDay: normalizedString(
        z.string()
            .trim()
            .min(10)
            .max(10)
            .regex(/^(13\d{2}|14\d{2})\/(0[1-9]|1[0-2])\/(0[1-9]|[12]\d|3[01])$/)
    ),
    nationalCode: normalizedString(
        z.string()
            .trim()
            .min(10)
            .max(10)
            .regex(/^[0-9]+$/)
            .refine(code => {
                if (!/^\d{10}$/.test(code)) return false;
                const check = +code[9];
                const sum = code
                    .split('')
                    .slice(0, 9)
                    .reduce((s, d, i) => s + (+d * (10 - i)), 0);
                const rem = sum % 11;
                return (rem < 2 && check === rem) || (rem >= 2 && check === 11 - rem);
            }, {
                message: "Invalid national code"
            })
    ).optional()
}).strict();

module.exports = {
    sanitizeSignupDTO
}