angular.module('todoApp', [])
    .controller('todos', ['$scope', function ($scope) {
        $scope.todoList = [];
        $scope.add = function (e) {
            $scope.todoList.push($scope.txt);
            $scope.txt = '';
            e.preventDefault();
        }
    }]);
