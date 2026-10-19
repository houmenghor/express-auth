const validate = (schema) => (req, res, next) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
        // ទាញយក Error ទាំងអស់ពី Zod
        const allErrors = result.error.flatten().fieldErrors;
        const cleanErrors = {};

        // Loop ដើម្បីចាប់យកតែ Error ទី ១ (index 0) សម្រាប់ Field នីមួយៗ
        for (const key in allErrors) {
            cleanErrors[key] = allErrors[key][0]; 
        }

        return res.status(422).json({
            result: false,
            message: 'Validation failed',
            errors: cleanErrors // បញ្ចេញតែ Error ដែលស្អាត
        });
    }

    req.validate = result.data; 
    next(); 
};

module.exports = validate;