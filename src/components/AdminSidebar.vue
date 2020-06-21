<template>
  <div>
    <el-menu class="right-navbar" :default-active="activeIndex" text-color="#FFFFFF" active-text-color="#F561A4" :router="true">
        <el-menu-item-group>
            <template slot="title">CCBC X 后台</template>
            <el-menu-item index="/userbackend">概览</el-menu-item>
            <el-menu-item index="/userbackend/answerlog">答案记录</el-menu-item>
        </el-menu-item-group>
        <el-menu-item-group>
            <template slot="title">用户与组队</template>
            <el-menu-item index="/userbackend/user">用户</el-menu-item>
            <el-menu-item index="/userbackend/group">组队</el-menu-item>
            <el-menu-item index="/userbackend/loginlog">登录记录</el-menu-item>
        </el-menu-item-group>
        <el-menu-item-group>
            <template slot="title">站点管理</template>
            <el-menu-item index="/userbackend/message">站内信</el-menu-item>
            <el-menu-item index="/userbackend/announcement">公告</el-menu-item>
        </el-menu-item-group>
        <el-menu-item-group>
            <template slot="title">题目编辑</template>
            <el-menu-item index="/userbackend/puzzle">题目管理</el-menu-item>
            <el-menu-item index="/userbackend/puzzlegroup">题目分区管理</el-menu-item>
            <el-menu-item @click="uploadVisible = true">上传图片</el-menu-item>
        </el-menu-item-group>
        <el-menu-item-group>
            <template slot="title">系统功能</template>
            <el-menu-item index="/userbackend/cachepurge">清理缓存</el-menu-item>
            <el-menu-item index="/">返回主站</el-menu-item>
        </el-menu-item-group>
    </el-menu>
    <el-dialog title="上传图片" :visible.sync="uploadVisible" :close-on-click-modal="false" :limit="1">
      <el-upload class="uploader-area" drag accept="image/*" action="bas" :http-request="upload" :show-file-list="false">
        <i class="el-icon-upload2"></i> 点击选择图片或将图片拖到这里
      </el-upload>
      <div class="upload-finish-files" v-for="uploadedItem in uploadResult" :key="uploadedItem.id">
        <div class="upload-result" v-if="uploadedItem.isUploaded == false">
          <span>{{uploadedItem.uploadingMessage}} {{uploadedItem.fileName}}</span>
          <el-progress :text-inside="true" :stroke-width="24" :percentage="uploadedItem.percentage" :status="uploadedItem.status"></el-progress>
        </div>
        <div class="upload-result" v-else>
          <el-input v-model="uploadedItem.url" :readonly="true">
            <template slot="prepend">URL:</template>
            <template slot="append">
              <el-button @click="uploadedItem.copyMd()">复制MD</el-button>
              <el-button @click="uploadedItem.copyUrl()">复制URL</el-button>
            </template>
          </el-input>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { fetchPostWithSign, defaultApiErrorAction } from '@/utils/fetchPost';
import { Upload, Progress } from 'element-ui';
import copyText from '@/utils/copyText';

@Component
export default class AdminSidebar extends Vue {
    @Prop() private activeIndex!: string
    uploadVisible: boolean = false;
    uploadResult: UploadedFileItem[] = [];
    mounted(){
      if(!this.isLogin || !this.isAdmin){
        this.$router.push("/");
        this.$gConst.globalBus.$emit("log-out", {
            message: "您不能查看指定页面。",
            type: "error"
        });
      }

      //清空已上传列表
      this.uploadResult = [];
    }

    get isLogin(){
      return localStorage.getItem("token") !== null;
    }

    get isAdmin(){
      return parseInt(localStorage.getItem("roleid") || "0") >= 4;
    }

    get username(){
      return localStorage.getItem("username") || "[空名称][NULL]";
    }

    async upload(uploadInfo: any){
      let file: File = uploadInfo.file;
      let fileItem = new UploadedFileItem(file);

      this.uploadResult.push(fileItem);

      let prepareApi = this.$gConst.apiRoot + "/admin/upload-prepare";
      let prepareRes = await fetchPostWithSign(prepareApi, {});
      let prepareData = await prepareRes.json();

      if (prepareData["status"] != 1) {
        defaultApiErrorAction(this, prepareData);
        fileItem.status = "error";
        fileItem.uploadingMessage = "上传失败" + prepareData["message"] + "：";
        return;
      }

      let uploadToken = prepareData["upload_token"];

      //使用form-data上传图片
      let formData = new FormData();
      formData.append("file", file);

      let uploadApi = this.$gConst.apiRoot + "/admin/upload-image";
      let xhr = new XMLHttpRequest();
      xhr.open("POST", uploadApi);
      xhr.setRequestHeader("Upload-Token", uploadToken);
      xhr.onerror = e => {
        this.$message({
          type: "error",
          message: "服务器通信异常"
        });
        throw e;
      }

      let self = this;

      let uploadProgressCb = (e: ProgressEvent) => fileItem.percentage = (e.loaded / e.total) * 100;
      if(xhr.upload) xhr.upload.onprogress = uploadProgressCb;
      else if(xhr.onprogress) xhr.onprogress = uploadProgressCb;
      xhr.onreadystatechange = () => {
        if(xhr.readyState == 4){
          var dataJson = xhr.responseText;
          var data = JSON.parse(dataJson);

          if(data["status"] != 1){
            defaultApiErrorAction(self, data);
          } else {
            this.$message({
              type: "success",
              message: "上传成功"
            });
            fileItem.url = data["image_path"];
            fileItem.isUploaded = true;
          }
        }
      }
      xhr.send(formData);
      
    }
}

class UploadedFileItem{
  id: string = "";
  status: string = "success";
  uploadingMessage: string = "上传中：";
  isUploaded = false; //是否上传完成
  fileName: string = ""; //文件名
  percentage: number = 0; //上传百分比
  url: string = ""; //URL
  file: File;
  constructor(f: File){
    this.file = f;
    this.fileName = f.name;
    this.id = "AZ" + f.name + "u_" + f.size + f.lastModified.toString() + "Dm" + f.type;
  }
  copyMd(){
    let mdString = `![image](${this.url})`;
    copyText(mdString);
  }
  copyUrl(){
    copyText(this.url);
  }
}

</script>

<style lang="scss" scoped>
.right-navbar{
  background-color: #555555;
  min-height: 100vh;
}
.el-menu{
  border-right: none;
}
.uploader-area{
  margin-top: 10px;
}
.upload-finish-files{
  margin-top: 10px;
}
.upload-result{
  margin-top: 10px;
}
</style>

<style lang="scss">
.el-upload{
  width: 100%;
}
.el-upload-dragger{
  width: 100%;
  height: 200px;
  border: 2px dashed #999999;
  border-radius: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: all 0.2s linear;
  background-color: #404853;
  cursor: pointer;
  color :#999999;
  letter-spacing: 15px;
  font-size: 20px;
}
.el-upload-dragger:hover{
  background-color: #515d6e;
  border-color: #999999;
}
.el-upload-list__item:hover {
  background-color: #464646;
}
.el-progress-bar__innerText{
  color: #FFFFFF;
}
.el-progress-bar__outer{
  background-color: #464646;
}
</style>