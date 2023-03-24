// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  api: 'https://localhost:7139',
  githubNotifyFilesAPI:
    'https://api.github.com/repos/chuazz/HeThongKhoaLuan_Assets/contents/Notify/Files/',
  githubMissionFilesAPI:
    'https://api.github.com/repos/chuazz/HeThongKhoaLuan_Assets/contents/Mission/Files/',
  githubToken: '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',
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
