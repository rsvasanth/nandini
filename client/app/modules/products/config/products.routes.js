(function () {
  'use strict';
  angular
    .module('com.module.products')
    .provider('modalState', function($stateProvider) {
    var provider = this;
    this.$get = function() {
        return provider;
    }
    this.state = function(stateName, options) {
        var modalInstance;
        $stateProvider.state(stateName, {
            url: options.url,
            onEnter: function($modal, $state) {
                modalInstance = $modal.open(options);
                modalInstance.result['finally'](function() {
                    modalInstance = null;
                    if ($state.$current.name === stateName) {
                        $state.go('^.list');
                    }
                });
            },
            onExit: function() {
                if (modalInstance) {
                    modalInstance.close();
                }
            }
        });
    };
})
    .config(function ($stateProvider,modalStateProvider) {
      $stateProvider
        .state('app.products', {
          abstract: true,
          url: '/products',
          templateUrl: 'modules/products/views/main.html'
        })
        .state('app.products.list', {
          url: '',
          templateUrl: 'modules/products/views/list.html',
          controllerAs: 'ctrl',
          controller: function (products) {
            this.products = products;
          },
          resolve: {

            products: [
              'ProductsService',
              function (ProductsService) {
                return ProductsService.getProducts();
              }
            ]
          }
        })
        .state('app.products.add', {
          url: '/add/:categoryId',
          templateUrl: 'modules/products/views/form.html',
          controllerAs: 'ctrl',
          controller: function ($state, ProductsService, categories, product) {
            this.categories = categories;
            this.product = product;
            this.formFields = ProductsService.getFormFields(categories);
            this.formOptions = {};
            this.submit = function () {
              ProductsService.upsertProduct(this.product).then(function () {
                $state.go('^.list');
              });
            };
          },
          resolve: {
            categories: function (CategoriesService) {
              return CategoriesService.getCategories();
            },
            product: function ($stateParams) {
              return {
                categoryId: $stateParams.categoryId
              };
            }
          }
        })
        .state('app.products.edit', {
          url: '/:productId/edit',
          templateUrl: 'modules/products/views/form.html',
          controllerAs: 'ctrl',
          controller: function ($state, ProductsService, categories, product) {
            this.categories = categories;
            this.product = product;
            this.formFields = ProductsService.getFormFields(categories);
            this.formOptions = {};
            this.submit = function () {
              ProductsService.upsertProduct(this.product).then(function () {
                $state.go('^.list');
              });
            };
          },
          resolve: {
            categories: function (CategoriesService) {
              return CategoriesService.getCategories();
            },
            product: function ($stateParams, ProductsService) {
              return ProductsService.getProduct($stateParams.productId);
            }
          }
        })
        .state('app.products.addcategory', {
          url: '/addcategory',
          templateUrl: 'modules/products/views/categoryform.html',
          controllerAs: 'ctrl',
          controller: function ($state, CategoriesService, category) {
            this.category = category;
            this.formFields = CategoriesService.getFormFields();
            this.formOptions = {};
            this.submit = function () {
              CategoriesService.upsertCategory(this.category).then(function () {
                $state.go('^.list');
              });
            };
          },
          resolve: {
            category: function () {
              return {};
            }
          }
        })

        .state('app.products.editcategory', {
          url: '/editcategory/:categoryId',
          templateUrl: 'modules/products/views/categoryform.html',
          controllerAs: 'ctrl',
          controller: function ($state, CategoriesService, category) {
            this.category = category;
            this.formFields = CategoriesService.getFormFields();
            this.formOptions = {};
            this.submit = function () {
              CategoriesService.upsertCategory(this.category).then(function () {
                $state.go('^.list');
              });
            };
          },
          resolve: {
            category: function ($stateParams, CategoriesService) {
              return CategoriesService.getCategory($stateParams.categoryId);
            }
          }
        })
        .state('app.products.deletecategory', {
          url: '/category/:categoryId/delete',
          template: '',
          controllerAs: 'ctrl',
          controller: function ($state, CategoriesService, product) {
            CategoriesService.deleteCategory(product.id, function () {
              $state.go('^.list');
            }, function () {
              $state.go('^.list');
            });
          },
          resolve: {
            product: function ($stateParams, CategoriesService) {
              return CategoriesService.getCategory($stateParams.categoryId);
            }
          }
        })
        .state('app.products.delete', {
          url: '/:productId/delete',
          template: '',
          controllerAs: 'ctrl',
          controller: function ($state, ProductsService, product) {
            ProductsService.deleteProduct(product.id, function () {
              $state.go('^.list');
            }, function () {
              $state.go('^.list');
            });
          },
          resolve: {
            product: function ($stateParams, ProductsService) {
              return ProductsService.getProduct($stateParams.productId);
            }
          }
        });
        modalStateProvider.state('app.products.view', {
          url: '/:productId',
          templateUrl: 'modules/products/views/view.html',
          controllerAs: 'ctrl',
          controller: function (product) {
            this.product = product;
            console.log(product);
          },
          resolve: {
            product: function ($stateParams, ProductsService) {
              return ProductsService.getProduct($stateParams.productId);
            }
          }
        });
    });

})();
