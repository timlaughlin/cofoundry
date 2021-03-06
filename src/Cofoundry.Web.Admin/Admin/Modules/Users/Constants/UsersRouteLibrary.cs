﻿using Cofoundry.Core;
using Cofoundry.Domain;
using System;
using System.Collections.Generic;
using System.Linq;

namespace Cofoundry.Web.Admin
{
    public class UsersRouteLibrary : AngularModuleRouteLibrary
    {
        public const string RoutePrefix = "users";
        
        public UsersRouteLibrary()
            : base(RoutePrefix, RouteConstants.InternalModuleResourcePathPrefix)
        {
        }

        #region routes

        public string List(IUserAreaDefinition definition)
        {
            return GetUserAreaRoute(definition);
        }

        public string New(IUserAreaDefinition definition)
        {
            if (definition == null) return string.Empty;
            return List(definition) + "new";
        }

        public string Details(IUserAreaDefinition definition, int id)
        {
            if (definition == null) return string.Empty;
            return List(definition) + id.ToString();
        }

        private static string GetUserAreaRoute(IUserAreaDefinition definition, string route = null)
        {
            if (definition == null) return string.Empty;
            return "/" + RouteConstants.AdminAreaPrefix + "/" + SlugFormatter.ToSlug(definition.Name) + "-users#/" + route;
        }

        #endregion
    }
}