const z = require('zod');
const {toGregorian} = require('jalaali-js');

const normalizeInput = (value) => {
    if (typeof value !== 'string') return value;
    try {
        return value.normalize("NFKC");
    } catch {
        return value;
    }
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
        z.string("name must be a string")
            .trim()
            .min(3,"name at least 3 characters")
            .max(30, "name maximum 30 characters")
            .regex(/^[A-Za-z]+$/, "name must contain only letters")
    ),
    family: z.union([
        z.undefined(),
        normalizedString(
            z.string("family must be a string")
                .trim()
                .min(3, 'family at least 3 characters')
                .max(30, "family maximum 30 characters")
                .regex(/^[A-Za-z]+$/, 'Family must contain only letters')
        )
    ]),
    phone: normalizedString(
        z.string("phone must be a string")
            .trim()
            .regex(/^09\d{9}$/, "phone format incorrect!")
            .refine((value) => {
                const prefix = value.slice(0, 4);
                return validIranMobilePrefixes.includes(prefix);
            }, {
                message: "Invalid Iranian mobile prefix"
            })
    ),
    email: z.union([
        z.undefined(),
        normalizedString(
            z.string("email must be a string")
                .trim()
                .min(10, "email at least 10 characters")
                .max(100, "email maximum 100 characters")
                .regex(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z]{2,}$/,
                    "Invalid email address")
        )
    ]),
    birthDay: normalizedString(
        z.string("birthDay must be a string")
            .trim()
            .min(10, "birthDay at least 10 characters")
            .max(10, "birthDay maximum 10 characters")
            .regex(/^(13\d{2}|14\d{2})\/(0[1-9]|1[0-2])\/(0[1-9]|[12]\d|3[01])$/,
                "Invalid birthDay format")
            .refine((value) => {
                try {
                    const [jy, jm, jd] = value.split("/").map(Number);
                    const {gy, gm, gd} = toGregorian(jy, jm, jd);
                    const birthDate = new Date(gy, gm - 1, gd);
                    const today = new Date().setHours(0, 0, 0, 0);

                    if (birthDate > today) return false;

                    const tenYearsAgo = new Date(
                        new Date().getFullYear() - 10,
                        new Date().getMonth(),
                        new Date().getDate()
                    );

                    return birthDate <= tenYearsAgo;
                } catch {
                    return false;
                }
            }, {
                message: "User must be at least 10 years old and birth date cannot be in the future"
            })
    ),
    nationalCode: z.union([
        z.undefined(),
        normalizedString(
            z.string("nationalCode must be a string")
                .trim()
                .min(10, "nationalCode must be at 10 characters")
                .max(10, "nationalCode maximum 10 characters")
                .regex(/^[0-9]+$/, "nationalCode must be Numbers")
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
                    message: "invalid national code"
                })
        )
    ]),
    password: normalizedString(
        z.string("password Must be String")
            .min(8, "Password must be at least 8 characters")
            .max(128, "Password maximum 128 characters")
            .superRefine((val, ctx) => {
                if (!/[A-Z]/.test(val)) {
                    ctx.addIssue("Missing uppercase letter");
                }
                if (!/[a-z]/.test(val)) {
                    ctx.addIssue("Missing lowercase letter");
                }
                if (!/[0-9]/.test(val)) {
                    ctx.addIssue("Missing Number");
                }
                if (!/[^A-Za-z0-9]/.test(val)) {
                    ctx.addIssue( "Missing special character");
                }
                if (!/^[\x20-\x7E]+$/.test(val)) {
                    ctx.addIssue("Password can only contain printable ASCII characters");
                }

            })
    ),
    confirmPassword: z.string("Confirm Password Must be String")
}).superRefine((data, ctx) => {
    if(data.password !== data.confirmPassword) {
        ctx.addIssue({
            code: "custom",
            path: ["confirmPassword"],
            message: "Passwords do not match"
        })
    }
    }
).strict();

module.exports = {
    sanitizeSignupDTO
}