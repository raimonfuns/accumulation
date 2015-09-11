<!DOCTYPE html>
<html>
<head>

<meta charset="utf-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
<meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
<title>{{% block title %}}{{% endblock %}}{[title]}</title>
<meta name="description" content="">
<meta name="keywords" content="{[keywords]}">
<link href="/style/common/base.css" rel="stylesheet">
{{% block head %}}{{% endblock %}}
</head>
<body>
{{% set navIndex = navIndex %}}
{{% include 'views/tpl/common/svip-header.tpl' with navIndex %}}
{{% block main %}}{{% endblock %}}
{{% include 'views/tpl/common/svip-footer.tpl' %}}
</body>
<script src="http://dl2.vip.yystatic.com/assets/js/jquery1.10.2.min.js"></script>
<script src="http://dl2.vip.yystatic.com/assets/js/sea2.0.0.js"></script>
{{% block footer %}}{{% endblock %}}
</html>