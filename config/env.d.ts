interface RequestConfig {
  path: string	      // -	开发者服务器路径	v2.146.4
  method: string	    // -  GET	HTTP 请求方法	v2.146.4
  dev?: boolean  	    // -  false	是否为开发环境	v2.146.4
  data?: object  	    // -	请求的参数	v2.146.4
  header?: object	    // -	设置请求的 header，header 中不能设置 Referer。content-type 默认为 application/json	v2.146.4
  timeout?: number    // -	超时时间，单位为毫秒。默认值为 60000	v2.146.4
}

interface RequestResponse<T = any> {
  code: string;
  message: string;
  data: T
}

interface UploadRequestConfig {
  path: string		      // -	开发者服务器路径	v2.146.4
  filePath: string		  // -	要上传的文件本地路径	v2.146.4
  formData?: object		// -	请求的参数	v2.146.4
  fileType?: string		// -  image	文件类型支持图片、视频、音频（ image / video / audio）	v2.146.4
  dev?: boolean		      // -  false	是否为开发环境	v2.146.4
  header?: object		  // -	自定义请求头	v2.146.4
  timeout?: number		  // -	超时时间，单位为毫秒。默认值为 60000	v2.146.4
}

interface DownloadRequestConfig {
  path: string		    // -	开发者服务器路径	v2.146.4
  dev?: boolean		    // -  false	是否为开发环境	v2.146.4
  header?: object		// -	自定义请求头	v2.146.4
}

interface DownloadResponse {
  code: string	        // 响应成功 code	v2.149.4
  tempFilePath: string	// 临时文件路径 (本地路径)。没传入 filePath 指定文件存储路径时会返回，下载后的文件会存储到一个临时文件	v2.149.4
  filePath: string	    // 用户文件路径 (本地路径)。传入 filePath 时会返回，跟传入的 filePath 一致	v2.149.4
}

interface CommonError {
  code: string;
  msg: string;
  doc: string
}

interface SystemInfo {
  pixelRatio: number	        // 设备像素比	v2.146.4
  windowWidth: number	      // 可使用窗口宽度，单位 px	v2.146.4
  windowHeight: number	      // 可使用窗口高度，单位 px	v2.146.4
  screenWidth: number	      // 屏幕宽度，单位 px	v2.146.4
  screenHeight: number	      // 屏幕高度，单位 px	v2.146.4
  platform: string	          // 客户端平台ios、android、 devtools 、mac 、windows	v2.146.4
  statusBarHeight: number	  // 状态栏的高度，单位 px，H5 返回 0	v2.146.4
  brand: string	            // 设备品牌，H5 返回 ‘’	v2.146.4
  model: string	            // 设备型号，H5 返回 ‘’	v2.146.4
  system: string	            // 操作系统及版本，H5 返回 ‘’	v2.146.4
  version: string	          // 小程序版本号，H5 返回 ‘’	v2.146.4
  SDKVersion: string	        // 小程序基础库版本号，H5 返回 ‘’	v2.146.4
}


interface NavgateOptions {
  route: string;
  query?: Record<string, any>
}

interface OpenWebViewOptions {
  url: string		                    // -	webview 路径	v2.146.4
  youzan?: boolean	                  // -	是否打开有赞 webview 容器	v2.146.4
  type?: 'navigate' | 'redirect' 		// -  navigate	跳转方式，仅支持 navigate ｜ redirect	v2.146.4
}

interface LoggerOptions {
  message: string	//	-	上报的日志内容	v2.146.4
  tagName?: string	//	-	日志分组名	v2.146.4
  detail: object	  //	-	日志内容的扩展信息，可传入事件名、流程名、事件参数、错误信息等	v2.146.4
}

interface ScanOptions {
  onlyFromCamera?: boolean               //	false	是否只能从相机扫码，不允许从相册选择图片	v2.149.4
  duration?: Array<'barCode' | 'qrCode'> //	['barCode', 'qrCode']	扫码类型	v2.149.4
}

interface ScanResult {
  result: string	  // 扫码内容	v2.149.4
  scanType: string	// 扫码类型	v2.149.4
  charSet: string	// 扫码字符集	v2.149.4
  path: string	    // 当所扫的码为当前小程序二维码时，会返回此字段，内容为二维码携带的 path	v2.149.4
  rawData: string	// 原始数据，base64 编码	v2.149.4
}

interface LocationOptions {
  type?: 'wgs84' | 'gcj02'  // wgs84 返回 gps 坐标，gcj02 返回可用于 wx.openLocation 的坐标
}

interface LocationResult {
  longitude:	number	// 经度	v2.146.4
  latitude:	number	// 纬度	v2.146.4
  horizontalAccuracy:	number	// 水平精度单位，web 端不支持	v2.146.4
  accuracy:	number	// 位置的精确度单位	v2.146.4
}

interface ScrollToOptions {
  scrollTop:	number	// -	滚动到页面的目标位置，单位 px	v2.149.4
  duration?:	number	// 300	滚动动画的时长，单位 ms	v2.149.4
}

interface MenuButtonBoundingRect {
  width:	number	// 宽度，单位：px	v2.149.4
  height:	number	// 高度，单位：px	v2.149.4
  top:	number	// 上边界坐标，单位：px	v2.149.4
  right:	number	// 右边界坐标，单位：px	v2.149.4
  bottom:	number	// 下边界坐标，单位：px	v2.149.4
  left:	number	// 左边界坐标，单位：px	v2.149.4
}

interface ChooseImageOptions {
  count?:	number		// 9	最多可以选择的图片张数	v2.146.4
  sizeType?:	string[]		// ['original', 'compressed']	所选的图片的尺寸	v2.146.4
  sourceType?:	string[]		// ['album', 'camera']	选择图片的来源	v2.146.4
}

interface ChooseImageResult {
  tempFilePaths:	string[]	// 图片的路径数组。	v2.146.4
  tempFiles:	string[]	// 图片的本地临时文件列表。	v2.146.4
}

interface PreviewImageOptions {
  urls:	string[]		// ['original', 'compressed']	预览的图片 url 集合	v2.146.4
  current?:	number		// 9	当前展示项	v2.146.4
}

interface ChooseVideoOptions {
  sourceType?:	Array<'album' | 'camera'>		// ['album', 'camera']	视频选择的来源	v2.149.4
  compressed?:	boolean		// true	是否压缩所选择的视频文件	v2.149.4
  maxDuration?:	number		// 60	拍摄视频最长拍摄时间	v2.149.4
  camera?:	'back' | 'front'		// back	默认拉起的是前置或者后置摄像头。部分 Android 手机下由于系统 ROM 不支持无法生效	v2.149.4
}

interface ChooseVideoResult {
  tempFilePath:	string	// 选定视频的临时文件路径 (本地路径)	v2.149.4
  duration:	number	// 选定视频的时间长度	v2.149.4
  size:	number	// 选定视频的数据量大小	v2.149.4
  height:	number	// 返回选定视频的高度	v2.149.4
  width:	number	// 返回选定视频的宽度	v2.149.4
}

interface OpenSettingResult {
  authSetting: {
    scope: {
      userInfo:	boolean	// 是否授权用户信息	v2.149.4
      userLocation:	boolean	// 是否授权地理位置	v2.149.4
      address:	boolean	// 是否授权通讯地址	v2.149.4
      invoiceTitle:	boolean	// 是否授权发票抬头	v2.149.4
      invoice:	boolean	// 是否授权获取发票	v2.149.4
      werun:	boolean	// 是否授权微信运动步数	v2.149.4
      record:	boolean	// 是否授权录音功能	v2.149.4
      writePhotosAlbum:	boolean	// 是否授权保存到相册	v2.149.4
      camera:	boolean	// 是否授权摄像头	v2.149.4
    }
  }
}

interface GetShareInfoOptions {
  shareTicket:	string	// 是	-	shareTicket	v2.149.4
  timeout?:	number	    // 否	-	超时时间，单位 ms	v2.149.4
}

interface ShareInfo {
  errMsg:	string	// 错误信息	v2.149.4
  encryptedData:	string	// 包括敏感数据在内的完整转发信息的加密数据	v2.149.4
  iv:	string	// 加密算法的初始向量	v2.149.4
}

interface ShowShareMenuOptions {
  withShareTicket?:	boolean	 // 否	false	是否使用带 shareTicket 的转发详情	v2.149.4
  menus?:	Array<'shareAppMessage' | 'shareTimeline'>	// 否	['shareAppMessage'、'shareTimeline']	需要显示的转发按钮名称列表	v2.149.4
}

interface SystemEnv {
  USER_DATA_PATH: string
}

interface WriteFileOptions {
  filePath: string
  data: string
  encoding: "base64"
}

interface FileSystemManager {
  writeFile: (options: WriteFileOptions) => Promise<any>
  close: () => void
}

interface OpenDocumentOptions {
  filePath: string
  showMenu: boolean
}

interface ChooseMessageFileOptions {
  count: number,
  type: "file",
  extension: string[],
}

interface ChooseMessageFileResult {
  tempFiles: Array<{
    size: number;
    path: string
  }>
}

declare namespace yz {
  function request(config: RequestConfig): Promise<RequestResponse>;

  function uploadFile(config: UploadRequestConfig): Promise<RequestResponse>;

  function downloadFile(config: DownloadRequestConfig): Promise<DownloadResponse>;

  function getSystemInfo(): Promise<SystemInfo>;

  function getEnvSync(): string;

  function navigateTo(options: NavgateOptions): Promise<boolean>

  function redirectTo(options: NavgateOptions): Promise<boolean>

  function switchTab(options: Omit<NavgateOptions, 'query'>): Promise<boolean>

  function reLaunch(options: NavgateOptions): Promise<boolean>

  function back(val: number): Promise<boolean>

  function openWebview(options: OpenWebViewOptions): Promise<string>

  function getCustomPageUrl(path: string): string

  function setClipboardData(value: string): Promise<void>

  function getClipboardData(): Promise<{ data: string }>

  function makePhoneCall(phoneNumber: string): Promise<void>

  function scanCode(options?: ScanOptions): Promise<ScanResult>

  function getLocation(options?: LocationOptions): Promise<LocationResult>

  function setNavigationBarTitle(title: string): Promise<void>

  function startPullDownRefresh(): Promise<void>

  function stopPullDownRefresh(): Promise<void>

  function pageScrollTo(options: ScrollToOptions): Promise<void>

  function getMenuButtonBoundingClientRect(): Promise<MenuButtonBoundingRect>

  function setStorage(key: string, data: any): Promise<void>
  function setStorageSync(key: string, data: any): void

  function getStorage(key: string): Promise<any>
  function getStorageSync(key: string): any

  function removeStorage(key: string): Promise<void>
  function removeStorageSync(key: string): void

  function clearStorage(): Promise<void>
  function clearStorageSync(): void

  function chooseImage(options?: ChooseImageOptions): Promise<ChooseImageResult>

  function previewImage(options: PreviewImageOptions): Promise<void>

  function chooseVideo(options?: ChooseVideoOptions): Promise<ChooseVideoResult>

  function openSetting(options?: {withSubscriptions?: boolean}): Promise<OpenSettingResult>

  function getShareInfo(options: GetShareInfoOptions): Promise<ShareInfo>

  function showShareMenu(options?: ShowShareMenuOptions): Promise<void>

  function getSystemEnv(): Promise<SystemEnv>

  function getFileSystemManager(): Promise<FileSystemManager>

  function openDocument(options: OpenDocumentOptions): Promise<any>

  function chooseMessageFile(options: ChooseMessageFileOptions): Promise<ChooseMessageFileResult>

  function getImageInfo(options: {src: string}): Promise<{
    errMsg: string;
    height: number
    orientation: string;
    path: string;
    type: string;
    width: number
  }>

  interface Logger {
    info(options: LoggerOptions): void
    warn(options: LoggerOptions): void
    error(options: LoggerOptions): void
  }

  interface Event {
    on(eventName: string, callback: (...args: any[]) => void, context: any): void
    off(eventName: string, callback: (...args: any[]) => void, context: any): void
    once(eventName: string, callback: (...args: any[]) => void, context: any): void
    trigger(eventName: string, ...args: any[]): void
  }

  export const logger: Logger;

  export const event: Event
}