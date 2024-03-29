import ttf2woff2 from "gulp-ttf2woff2";
import fs from "fs";
import fonter from "gulp-fonter";

export function otfToTtf() {
  return app.gulp
    .src(`${app.path.srcFolder}/fonts/*.otf`, {})
    .pipe(
      app.plugins.plumber(
        app.plugins.notify.onError({
          title: "Fonts",
          message: "Error: <%= error.message %>",
        })
      )
    )
    .pipe(
      fonter({
        formats: ["ttf"],
      })
    )
    .pipe(app.gulp.dest(`${app.path.srcFolder}/fonts/`));
}

export function ttfToWoff() {
  return app.gulp
    .src(`${app.path.srcFolder}/fonts/*.ttf`, {})
    .pipe(
      app.plugins.plumber(
        app.plugins.notify.onError({
          title: "Fonts",
          message: "Error: <%= error.message %>",
        })
      )
    )
    .pipe(
      fonter({
        formats: ["woff"],
      })
    )
    .pipe(app.gulp.dest(`${app.path.build.fonts}`))
    .pipe(app.gulp.src(`${app.path.srcFolder}/fonts/*.ttf`))
    .pipe(ttf2woff2())
    .pipe(app.gulp.dest(`${app.path.build.fonts}`));
}

export function generateFonts() {
  fs.readdir(app.path.build.fonts, function (err, fonts) {

    if (fonts) {
      const fontsFile = `${app.path.srcFolder}/scss/styles/base/fonts.scss`;

      if (!fs.existsSync(fontsFile)) {
        fs.writeFile(fontsFile, "", () => {});

        let previousFontName;
        for (var i = 0; i < fonts.length; i++) {
          const font = fonts[i].split(".")[0];

          if (previousFontName !== font) {
            const fontArr = font.split("-");

            const [fontName, fontWeight] = fontArr;
            let fontWeightNumber;

              switch (fontWeight.toLowerCase()) {
                case "light":
                  fontWeightNumber = 300;
                  break;
                case "regular":
                  fontWeightNumber = 400;
                  break;
                case "medium":
                  fontWeightNumber = 500;
                  break;
                case "semibold":
                  fontWeightNumber = 600;
                  break;
                case "bold":
                  fontWeightNumber = 700;
                  break;
              }
            console.log(fontWeightNumber);

            fs.appendFile(
              fontsFile,             
`@font-face {
  font-family: "${fontName}";
  src: url("../fonts/${font}.woff2") format("woff2"),
        url("../fonts/${font}.woff") format("woff");
  font-weight: ${fontWeightNumber || 300};
  font-style: normal;
  font-display: swap;
}

`
                ,
              () => {}
            );

            previousFontName = font;
          }
        }
      } else {
        console.log("Файл fonts.scss уже существует. Его нужно удалить.");
      }
    }
  });

  return app.gulp.src(`${app.path.srcFolder}`);
}
