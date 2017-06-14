/*
Licensed to the Apache Software Foundation (ASF) under one or more
contributor license agreements.  See the NOTICE file distributed with
this work for additional information regarding copyright ownership.
The ASF licenses this file to You under the Apache License, Version 2.0
(the "License"); you may not use this file except in compliance with
the License.  You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/
package org.acme.bestpublishing.evaluators;

import org.alfresco.error.AlfrescoRuntimeException;
import org.alfresco.web.evaluator.BaseEvaluator;
import org.json.JSONException;
import org.json.simple.JSONObject;
import org.springframework.extensions.surf.RequestContext;
import org.springframework.extensions.surf.ServletUtil;
import org.springframework.extensions.surf.exception.ConnectorServiceException;
import org.springframework.extensions.surf.support.ThreadLocalRequestContext;
import org.springframework.extensions.webscripts.Status;
import org.springframework.extensions.webscripts.connector.Connector;
import org.springframework.extensions.webscripts.connector.Response;

/**
 * This evaluator checks if the book metadata has been modified after last publishing date.
 * <p/>
 * It also checks if the book has been published at all, if not that counts as metadata updated.
 *
 * @author martin.bergljung@marversolutions.org
 * @version 1.0
 */
public class MetadataUpdatedEvaluator extends BaseEvaluator {

    @Override
    public boolean evaluate(JSONObject jsonObject) {
        final JSONObject node = (JSONObject) jsonObject.get("node");// get node
        final String isbnNodeRef = (String) node.get("nodeRef");// get noderef of content
        boolean isMetadataUpdated = checkMetadataStatus(isbnNodeRef);

        return isMetadataUpdated;
    }

    /**
     * Call custom Alfresco Repo Web Script, which will figure out if any metadata
     * has been updated since last book publishing date.
     *
     * @param isbnNodeRef
     * @return metadata status, true if it has been updated, false if not updated since last publish date
     */
    private boolean checkMetadataStatus(String isbnNodeRef) {
            boolean result = false;

        try {
            // We are in Share, get a connector so we can call an Alfresco Platform/Repo Web Script
            RequestContext rc = ThreadLocalRequestContext.getRequestContext();
            String userId = rc.getUserId();
            Connector conn = rc.getServiceRegistry().getConnectorService().
                    getConnector("alfresco", userId, ServletUtil.getSession());

            // Make the Repo Web Script call to make the actual check
            String url = "/bestpub/checkMetadataUpdates?nodeRef=" + isbnNodeRef;
            Response response = conn.call(url);

            if (Status.STATUS_OK == response.getStatus().getCode()) {
                org.json.JSONObject scriptResponse = new org.json.JSONObject(response.getResponse());
                result = scriptResponse.getBoolean("isMetadataUpdated");
            } else {
                throw new AlfrescoRuntimeException("Could not check metadata updates: " +
                        response.getStatus().getMessage());
            }
        } catch (ConnectorServiceException e) {
            throw new AlfrescoRuntimeException("Failed to connect to repository: " + e.getMessage());
        } catch (JSONException e) {
            throw new AlfrescoRuntimeException("Failed to parse JSON string: " + e.getMessage());
        }

        return result;
    }
}
