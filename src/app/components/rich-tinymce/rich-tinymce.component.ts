import { Component, Input, Output, EventEmitter } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { EditorModule, EditorComponent } from "@tinymce/tinymce-angular";
import { NzMessageService } from "ng-zorro-antd/message";
import tinymce from "tinymce/tinymce"; //tinymce默认hidden，不引入不显示
import "tinymce/themes/silver/theme"; // 主题文件
import "tinymce/icons/default"; // tinymce插件可按自己的需要进行导入
import "tinymce/plugins/image"; // 插入上传图片插件
import "tinymce/plugins/importcss"; //图片工具
import "tinymce/plugins/media"; // 插入视频插件
import "tinymce/plugins/table"; // 插入表格插件
import "tinymce/plugins/lists"; // 列表插件
import "tinymce/plugins/charmap"; // 特殊字符
import "tinymce/plugins/wordcount"; // 字数统计插件
import "tinymce/plugins/code"; // 查看源码
import "tinymce/plugins/link"; //编辑链接
import "tinymce/plugins/insertdatetime"; //时间插入
import "tinymce/plugins/nonbreaking"; //插入不间断空格
import "tinymce/plugins/advlist"; //高级列表插件
import "tinymce/skins/content/default/content.css"; //内容区域css样式
import "tinymce/skins/ui/oxide/content.min.css"; //皮肤
import "tinymce/skins/ui/oxide/skin.min.css"; //皮肤
import "assets/tinymce/indent2em/plugin.js"; //首航缩进
import "assets/tinymce/langs/zh-Hans.js"; //语言

@Component({
  selector: "rich-tinymce",
  imports: [FormsModule, EditorModule],
  templateUrl: "./rich-tinymce.component.html"
})
export class RichTinymceComponent {
  @Input() inputValue: string = "";
  @Output() inputValueChange = new EventEmitter<string>();
  constructor(private message: NzMessageService) {}
  init: EditorComponent["init"] = {
    height: 400,
    selector: "textarea",
    language: "zh-Hans",
    skin: false,
    content_css: false,
    plugins: "code image link media table charmap nonbreaking insertdatetime advlist lists wordcount indent2em",
    toolbar:
      "code undo redo cut copy paste pastetext forecolor backcolor bold italic underline strikethrough link | alignleft aligncenter alignright alignjustify outdent indent indent2em | \
       styleselect formatselect fontselect fontsizeselect | bullist numlist | blockquote subscript superscript removeformat nonbreaking| \
                       table image media charmap insertdatetime lineheight",
    fontsize_formats: "12px 14px 16px 18px 24px 36px 48px 56px 72px",
    font_formats:
      "微软雅黑=Microsoft YaHei,Helvetica Neue,PingFang SC,sans-serif;苹果苹方=PingFang SC,Microsoft YaHei,sans-serif;宋体=simsun,serif;仿宋体=FangSong,serif;黑体=SimHei,sans-serif;Arial=arial,helvetica,sans-serif;Arial Black=arial black,avant garde;Book Antiqua=book antiqua,palatino;Comic Sans MS=comic sans ms,sans-serif;Courier New=courier new,courier;Georgia=georgia,palatino;Helvetica=helvetica;Impact=impact,chicago;Symbol=symbol;Tahoma=tahoma,arial,helvetica,sans-serif;Terminal=terminal,monaco;Times New Roman=times new roman,times;Verdana=verdana,geneva;Webdings=webdings;Wingdings=wingdings,zapf dingbats;知乎配置=BlinkMacSystemFont, Helvetica Neue, PingFang SC, Microsoft YaHei, Source Han Sans SC, Noto Sans CJK SC, WenQuanYi Micro Hei, sans-serif;小米配置=Helvetica Neue,Helvetica,Arial,Microsoft Yahei,Hiragino Sans GB,Heiti SC,WenQuanYi Micro Hei,sans-serif",
    // 解决粘贴图片后，不自动上传，而是使用base64编码。
    urlconverter_callback: (url: string) => {
      if (url.startsWith("blob:http")) {
        tinymce.activeEditor && tinymce.activeEditor.uploadImages();
      }
      return url;
    },
    // 此处为图片上传处理函数
    images_upload_handler: (blobInfo: any, success: any) => {
      if (blobInfo.base64()) {
        if (blobInfo.blob().size > 1048576) {
          success("");
          this.message.error("图片过大，上传失败！");
          return;
        }
        success("data:" + blobInfo.blob().type + ";base64," + blobInfo.base64());
      }
    },
    // menubar: false, //隐藏菜单栏
    resize: false, //关闭缩放
    autosave_ask_before_unload: false,
    toolbar_mode: "wrap",
    automatic_uploads: false,
    promotion: false,
    powerpaste_allow_local_images: true,
    paste_data_images: true,
    default_link_target: "_blank",
    link_default_protocol: "https"
  };
  onChange() {
    this.inputValueChange.emit(this.inputValue);
  }
}
