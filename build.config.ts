import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  entries: ['src/index'],
  clean: true,
  declaration: true,
  replace: {
    'import.meta.vitest': 'false',
  },
  rollup: {
    emitCJS: true,
  },
})
