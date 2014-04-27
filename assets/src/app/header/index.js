angular.module( 'sailng.header', [
])

.controller( 'HeaderCtrl', function HeaderController( $scope, $state, config ) {
    $scope.currentUser = config.currentUser;

    var navItems = [
        {title: 'Messages', translationKey: 'navigation:messages', url: '/messages', cssClass: 'fa fa-comments'},
        {title: 'Todos', translationKey: 'navigation:todos', url: '/todos', cssClass: 'fa fa-comments'},
        {title: 'Funds', translationKey: 'navigation:funds', url: '/funds', cssClass: 'fa fa-comments'},
        {title: 'Deals', translationKey: 'navigation:deals', url: '/deals', cssClass: 'fa fa-comments'},
        {title: 'Contact', translationKey: 'navigation:contacts', url: '/contacts', cssClass: 'fa fa-comments'},

        {title: 'About', translationKey: 'navigation:about', url:'/about',cssClass: 'fa fa-info-circle'}
    ];

    if (!$scope.currentUser) {
        navItems.push({title: 'Register', translationKey: 'navigation:register', url: '/register', cssClass: 'fa fa-briefcase'});
        navItems.push({title: 'Login', translationKey: 'navigation:login', url: '/login', cssClass: 'fa fa-comments'});
    }

    $scope.navItems = navItems;
});