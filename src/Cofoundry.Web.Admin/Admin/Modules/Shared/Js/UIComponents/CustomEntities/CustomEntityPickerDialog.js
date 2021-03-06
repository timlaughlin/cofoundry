﻿angular.module('cms.shared').controller('CustomEntityPickerDialogController', [
    '$scope',
    'shared.LoadState',
    'shared.customEntityService',
    'shared.SearchQuery',
    'shared.modalDialogService',
    'shared.internalModulePath',
    'shared.permissionValidationService',
    'options',
    'close',
function (
    $scope,
    LoadState,
    customEntityService,
    SearchQuery,
    modalDialogService,
    modulePath,
    permissionValidationService,
    options,
    close) {
    
    var vm = $scope;
    init();
    
    /* INIT */
    
    function init() {
        angular.extend($scope, options);

        vm.onOk = onOk;
        vm.onCancel = onCancel;
        vm.onSelect = onSelect;
        vm.onCreate = onCreate;
        vm.selectedEntity = vm.currentEntity; // current entity is null in single mode
        vm.onSelectAndClose = onSelectAndClose;
        vm.close = onCancel;

        vm.gridLoadState = new LoadState();
        vm.query = new SearchQuery({
            onChanged: onQueryChanged,
            useHistory: false,
            defaultParams: options.filter
        });
        vm.presetFilter = options.filter;

        vm.filter = vm.query.getFilters();
        vm.toggleFilter = toggleFilter;
        vm.isSelected = isSelected;
        vm.customEntityDefinition = options.customEntityDefinition;
        vm.multiMode = vm.selectedIds ? true : false;

        vm.canCreate = getPermission('COMCRT');

        toggleFilter(false);
        loadGrid();
    }

    /* ACTIONS */

    function toggleFilter(show) {
        vm.isFilterVisible = _.isUndefined(show) ? !vm.isFilterVisible : show;
    }

    function onQueryChanged() {
        toggleFilter(false);
        loadGrid();
    }

    function loadGrid() {
        vm.gridLoadState.on();

        return customEntityService.getAll(vm.query.getParameters(), options.customEntityDefinition.customEntityDefinitionCode).then(function (result) {
            vm.result = result;
            vm.gridLoadState.off();
        });
    }
    
    /* EVENTS */

    function onCancel() {
        if (!vm.multiMode) {
            // in single-mode reset the entity
            vm.onSelected(vm.currentEntity);
        }
        close();
    }

    function onSelect(entity) {
        if (!vm.multiMode) {
            vm.selectedEntity = entity;
            return;
        }

        addOrRemove(entity);
    }

    function onSelectAndClose(entity) {
        if (!vm.multiMode) {
            vm.selectedEntity = entity;
            onOk();
            return;
        }

        addOrRemove(entity);
        onOk();
    }

    function onOk() {
        if (!vm.multiMode) {
            vm.onSelected(vm.selectedEntity);
        } else {
            vm.onSelected(vm.selectedIds);
        }

        close();
    }

    function onCreate() {
        modalDialogService.show({
            templateUrl: modulePath + 'UIComponents/CustomEntities/AddCustomEntityDialog.html',
            controller: 'AddCustomEntityDialogController',
            options: {
                customEntityDefinition: options.customEntityDefinition,
                onComplete: onComplete
            }
        });

        function onComplete(customEntityId) {
            if (!vm.multiMode) {
                onSelect({ customEntityId: customEntityId });
                loadGrid();
            } else {
                onSelectAndClose({ customEntityId: customEntityId });
            }
        }
    }

    /* PUBLIC HELPERS */

    function getPermission(code) {
        return permissionValidationService.hasPermission(options.customEntityDefinitionCode + code);
    }

    function isSelected(entity) {
        if (vm.selectedIds && entity && vm.selectedIds.indexOf(entity.customEntityId) > -1) return true;

        if (!entity || !vm.selectedEntity) return false;
        
        return entity.customEntityId === vm.selectedEntity.customEntityId;
    }

    function addOrRemove(entity) {
        if (!isSelected(entity)) {
            vm.selectedIds.push(entity.customEntityId);
        } else {
            var index = vm.selectedIds.indexOf(entity.customEntityId);
            vm.selectedIds.splice(index, 1);
        }
    }
}]);
