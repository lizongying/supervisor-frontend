# supervisor-frontend
base https://github.com/PanJiaChen/vue-admin-template
本项目可以和https://github.com/lizongying/supervisor-backend结合使用

## Build

```bash
# build for test environment
npm run build:stage

# build for production environment
npm run build:prod
```

## Advanced

```bash
# preview the release environment effect
npm run preview

# preview the release environment effect + static resource analysis
npm run preview -- --report

# code format check
npm run lint

# code format check and auto fix
npm run lint -- --fix
```


## 注意！部署前一定要修改src/settings.js