// webpack, babel, babel-preset-env - все это позволяет минимизировать файлы js, BABEL - транспилирует JS, преобразуя современный код в более старые версии. babel-preset-env - является в данном инструменте полифиллом

const config = {
    mode: 'production', // сть production и developer (два режима работы)
    entry: { // точки входа (какие js файлы будет собирать)
        index: './src/js/index.js',
    },
    output: {
        filename: '[name].bundle.js',
    },
    module: { // загрузчик для css (импорт css в js)
        rules: [
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader'],
            },
        ],
    },
};

module.exports = config;