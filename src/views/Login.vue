<template>
  <div class="Login_container">
    <div class="login_box">
      <!--头像区域-->
      <div class="avatar_box"> 
        <img src="../assets/logo.png">
      </div>
      <!--登录表单区域-->
      <el-form :model="LoginForm" :rules="LoginFormRules" ref="LoginFormRef" class="loginForm">
        <!--登录表单账号username-->
        <el-form-item prop="username">
          <el-input type="text" v-model="LoginForm.username" placeholder="请输入账号" autocomplete="off" prefix-icon="el-icon-user-solid"></el-input>
        </el-form-item>
        <!--登录表单密码password-->
        <el-form-item prop="password">
          <el-input type="password" v-model="LoginForm.password" placeholder="请输入密码" autocomplete="off" prefix-icon="iconfont icon-3702mima"></el-input>
        </el-form-item>
        <!--登录表单提交重置-->
        <el-form-item class="btns">
          <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
          <el-button @click="resetForm('ruleForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  name:'Login',
  data(){
    return{
      LoginForm:{
        username:'admin',
        password:'123456',
      },
       LoginFormRules:{
         //验证账号密码是否合法
        username:[
          { required: true, message: '请输入账号', trigger: 'blur' },
          { min: 5, max: 12, message: '长度在 5 到 12 个字符', trigger: 'blur' }
          ],
        password:[
          {required: true, message: '请输入密码', trigger: 'blur'},
          { min: 6, max: 12, message: '长度在 6 到 12 个字符', trigger: 'blur' }
          ]
      }
    }
  },
   methods:{
    submitForm(){
      this.$refs.LoginFormRef.validate(
        async valid => {
        if (valid) { 
          //表示前面的规则复合校验 然后判断账号密码是否存在
          const {data:res}= await this.$http.post('login',this.LoginForm)
          if(res.meta.status != 200){
            this.$message.error('账号密码错误')
          }else{
            this.$message.success('登陆成功')
            //登陆成功以后将token串保存到sessionStroage中
            sessionStorage.setItem('token',res.data.token)
            this.$router.replace('home')
          }
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
     resetForm() {
      this.$refs.LoginFormRef.resetFields();
    }
  }
}
</script>

<style lang="less" scoped>
.Login_container{
  background-color: #2b4b6b;
  height: 100%;
}
.login_box{
  width: 450px;
  height: 300px;
  background-color: #fff;
  border-radius: 5px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%,-50%);

  .avatar_box{
    height: 130px;
    width: 130px;
    border: 1px solid #3de;
    border-radius: 50%;
    padding: 10px;
    box-shadow: 0 0 10px #ddd;
    position: absolute;
    left: 50%;
    transform: translate(-50%,-50%);
    background-color: #fff;
    img{
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background-color: #3de;
    }
  }
}
.loginForm{
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
}
.btns{
  display: flex;
  justify-content: space-around;
}

</style>