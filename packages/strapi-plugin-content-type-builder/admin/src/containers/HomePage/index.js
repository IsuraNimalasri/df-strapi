/**
 *
 * HomePage
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { isEmpty } from 'lodash';

import {
  HeaderNav,
  ListWrapper,
  ListHeader,
  List,
  PluginHeader,
  getQueryParameters,
  routerPropTypes,
} from 'strapi-helper-plugin';

import EmptyContentTypeView from '../../components/EmptyContentTypeView';
import pluginId from '../../pluginId';
import ModelForm from '../ModelForm';
import Row from './Row';
import styles from './styles.scss';

const getUrl = to => `/plugins/${pluginId}${to}`;
const getNavTrad = trad =>
  `${pluginId}.home.contentTypeBuilder.headerNav.link.${trad}`;

class HomePage extends React.Component {
  // eslint-disable-line react/prefer-stateless-function
  headerNavLinks = [
    {
      name: getNavTrad('models'),
      to: getUrl('/models'),
    },
    {
      name: getNavTrad('groups'),
      to: getUrl('/groups'),
    },
  ];

  handleClick = () => {
    const {
      canOpenModal,
      history: { push },
    } = this.props;
    const { emitEvent } = this.context;

    if (canOpenModal) {
      emitEvent('willCreateContentType');
      push({
        search: 'modalType=model&settingType=base&actionType=create',
      });
    } else {
      strapi.notification.info(
        `${pluginId}.notification.info.contentType.creating.notSaved`
      );
    }
  };

  handleDelete = isTemporary => {
    const { canOpenModal } = this.props;

    if (canOpenModal || isTemporary) {
      this.setState({});
    }
  };

  handleGoTo = (to, source, shouldEdit = false) => {
    const {
      history: { push },
      match: {
        params: { type },
      },
    } = this.props;
    const modalType = type === 'models' ? 'model' : 'group';
    const search = shouldEdit
      ? `?modalType=${modalType}&settingType=base&actionType=edit&modelName=${to}`
      : '';
    push(
      `/plugins/${pluginId}/${type}/${to.toLowerCase()}${
        source ? `&source=${source}` : ''
      }${search}`
    );
  };

  render() {
    const {
      cancelNewContentType,
      canOpenModal,
      connections,
      createTempContentType,
      deleteGroup,
      deleteModel,
      deleteTemporaryGroup,
      deleteTemporaryModel,
      groups,
      history: { push },
      location: { pathname, search },
      match: {
        params: { type },
      },
      models,
      modifiedData,
      newContentType,
      onChangeNewContentTypeMainInfos,
    } = this.props;
    const displayedData = type === 'groups' ? groups : models;
    const availableNumber = type === 'groups' ? groups.length : models.length;
    const titleType = type === 'groups' ? type : 'contentType';
    const title = `${pluginId}.table.${titleType}.title.${
      availableNumber > 1 ? 'plural' : 'singular'
    }`;

    return (
      <div className={styles.homePage}>
        <PluginHeader
          title={{
            id: `${pluginId}.home.contentTypeBuilder.name`,
          }}
          description={{
            id: `${pluginId}.home.contentTypeBuilder.description`,
          }}
          actions={[]}
        />
        <HeaderNav links={this.headerNavLinks} />

        {availableNumber === 0 ? (
          <EmptyContentTypeView
            handleButtonClick={this.handleClick}
            type={type}
          />
        ) : (
          <ListWrapper>
            <ListHeader
              title={title}
              titleValues={{ number: availableNumber }}
              button={{
                kind: 'secondaryHotlineAdd',
                label: `${pluginId}.button.${type}.create`,
                onClick: this.handleClick,
              }}
            />
            <List>
              <table>
                <tbody>
                  {displayedData.map(data => (
                    <Row
                      key={data.name}
                      canOpenModal={canOpenModal}
                      context={this.context}
                      deleteGroup={deleteGroup}
                      deleteModel={deleteModel}
                      deleteTemporaryGroup={deleteTemporaryGroup}
                      deleteTemporaryModel={deleteTemporaryModel}
                      onClickGoTo={this.handleGoTo}
                      {...data}
                      viewType={type}
                    />
                  ))}
                </tbody>
              </table>
            </List>
          </ListWrapper>
        )}

        <ModelForm
          actionType="create"
          activeTab={getQueryParameters(search, 'settingType')}
          cancelNewContentType={cancelNewContentType}
          connections={connections}
          createTempContentType={createTempContentType}
          currentData={modifiedData}
          modifiedData={newContentType}
          onChangeNewContentTypeMainInfos={onChangeNewContentTypeMainInfos}
          isOpen={!isEmpty(search)}
          pathname={pathname}
          push={push}
        />
      </div>
    );
  }
}

HomePage.contextTypes = {
  emitEvent: PropTypes.func.isRequired,
  plugins: PropTypes.object,
  updatePlugin: PropTypes.func,
};

HomePage.defaultProps = {
  canOpenModal: true,
  connections: ['default'],
  models: [],
  modifiedData: {},
};

HomePage.propTypes = {
  cancelNewContentType: PropTypes.func.isRequired,
  canOpenModal: PropTypes.bool,
  connections: PropTypes.array,
  createTempContentType: PropTypes.func.isRequired,
  deleteGroup: PropTypes.func.isRequired,
  deleteModel: PropTypes.func.isRequired,
  deleteTemporaryGroup: PropTypes.func.isRequired,
  models: PropTypes.array,
  modifiedData: PropTypes.object,
  newContentType: PropTypes.shape({
    collectionName: PropTypes.string,
    connection: PropTypes.string,
    description: PropTypes.string,
    mainField: PropTypes.string,
    name: PropTypes.string,
    attributes: PropTypes.object,
  }).isRequired,
  onChangeNewContentTypeMainInfos: PropTypes.func.isRequired,
  ...routerPropTypes().history.isRequired,
};

export default HomePage;
