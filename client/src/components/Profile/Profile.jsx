import React from 'react';
import { connect } from 'react-redux';
import { Row, Col, Button } from 'antd';
import Loading from '../../utils/Loading';
import moment from 'moment';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { useState } from 'react';
import ShareButtons from '../utils/Share Buttons/ShareButtons';
import '../../utils/flexbox.scss';
import { blue } from '@ant-design/colors';
import { Typography } from 'antd';
const { Title, Text } = Typography;

const Profile = ({ user }) => {
    const [isCopied, setIsCopied] = useState(false);

    const template =
        user === null ? (
            <Row
                type='flex'
                align='middle'
                justify='center'
                style={{ height: '100vh', width: '100vw' }}
            >
                <Col span={4}>
                    <Loading />
                </Col>
            </Row>
        ) : (
            <Row type='flex' justify='center' gutter={[16, 8]}>
                <Col
                    xs={20}
                    sm={18}
                    md={18}
                    lg={18}
                    xl={16}
                    style={{
                        backgroundColor: blue[5],
                        padding: '10px',
                        margin: '15px',
                        borderRadius: '10px'
                    }}
                >
                    <Title
                        level={3}
                        style={{ marginBottom: 0, color: '#fff' }}
                        className='myFlex'
                    >
                        {user.name}
                    </Title>

                    <Text
                        className='myFlex'
                        style={{
                            color: '#fff'
                        }}
                    >
                        {moment(user.created_at, 'YYYYMMDD').fromNow()}{' '}
                        qeydiyyatdan keçdiniz. Quizinizi dostlarınızla aşağıdakı
                        linkdən paylaşın 😊
                    </Text>
                </Col>
                <Col
                    xs={20}
                    sm={18}
                    md={18}
                    lg={18}
                    xl={16}
                    style={{
                        backgroundColor: '#ddd',
                        padding: '10px',
                        borderRadius: '10px',
                        margin: '5px 5px 0 5px'
                    }}
                >
                    <Row type='flex' justify='center'>
                        <Col
                            xs={20}
                            sm={18}
                            md={18}
                            lg={18}
                            xl={16}
                            className='myFlex'
                        >
                            <Title level={3}>
                                Dostlarını hazırladığın quizə dəvət et!
                            </Title>
                        </Col>
                        <Col
                            xs={20}
                            sm={18}
                            md={18}
                            lg={18}
                            xl={16}
                            style={{ marginBottom: '10px' }}
                            className='myFlex'
                        >
                            {!isCopied ? (
                                <CopyToClipboard
                                    text='www.quizmaker.com/user1/quiz'
                                    onCopy={() => setIsCopied(true)}
                                >
                                    <Button
                                        type='primary'
                                        style={{
                                            width: '70%'
                                        }}
                                    >
                                        Linki kopyala
                                    </Button>
                                </CopyToClipboard>
                            ) : (
                                <Button disabled>Linki kopyalandı</Button>
                            )}
                        </Col>
                        <Col
                            xs={20}
                            sm={18}
                            md={18}
                            lg={18}
                            xl={16}
                            className='myFlex'
                        >
                            <ShareButtons />
                        </Col>
                    </Row>
                </Col>
            </Row>
        );

    return template;
};

const mapStateToProps = ({ auth: { user } }) => ({
    user
});

export default connect(mapStateToProps, null)(Profile);
