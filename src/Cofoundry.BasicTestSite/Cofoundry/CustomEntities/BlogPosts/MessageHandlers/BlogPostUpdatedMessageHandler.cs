﻿using Cofoundry.Core.MessageAggregator;
using Cofoundry.Domain;
using Cofoundry.Domain.CQS;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Cofoundry.BasicTestSite
{
    public class BlogPostUpdatedMessageHandler : IMessageHandler<ICustomEntityContentUpdatedMessage>
    {
        private readonly IQueryExecutor _queryExecutor;

        public BlogPostUpdatedMessageHandler(
            IQueryExecutor queryExecutor
            )
        {
            _queryExecutor = queryExecutor;
        }

        public Task HandleAsync(ICustomEntityContentUpdatedMessage message) 
        {
            if (message.CustomEntityDefinitionCode != BlogPostCustomEntityDefinition.DefinitionCode) return Task.CompletedTask;

            // TODO: stuff

            return Task.CompletedTask;
        }
    }
}
