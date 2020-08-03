module.exports = {
    plugins: {
        'postcss-import': {},
        'postcss-preset-env': {
            autoprefixer: { grid: 'autoplace' },
            stage: 1,
            features: {
                'nesting-rules': true,
            },
        },
        cssnano: {},
    },
};
